import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { createRoot } from 'react-dom/client'
import { EquilibriumTemplate } from '../components/EquilibriumTemplate'
import type { Project } from '../types/project'
import { renderDrawingToDataUrl } from './renderDrawing'
import { downloadBlob } from './export'

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w\s-]/g, '').trim() || 'projeto'
}

async function renderTemplateCanvas(
  project: Project,
  drawingUrl: string | null,
): Promise<HTMLCanvasElement> {
  const host = document.createElement('div')
  host.style.position = 'fixed'
  host.style.left = '-12000px'
  host.style.top = '0'
  document.body.appendChild(host)

  const root = createRoot(host)

  await new Promise<void>((resolve) => {
    root.render(
      <EquilibriumTemplate
        project={project}
        drawingUrl={drawingUrl}
        onReady={() => resolve()}
      />,
    )
  })

  await new Promise((r) => setTimeout(r, 80))

  const target = host.firstElementChild as HTMLElement
  const canvas = await html2canvas(target, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  })

  root.unmount()
  host.remove()
  return canvas
}

export async function exportProjectToTemplatePdf(
  project: Project,
  download = true,
): Promise<Blob> {
  const drawingUrl = renderDrawingToDataUrl(project.shapes)
  const canvas = await renderTemplateCanvas(project, drawingUrl)
  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  pdf.addImage(imgData, 'PNG', 0, 0, pageW, pageH)
  pdf.setProperties({ title: project.name })

  const blob = pdf.output('blob')
  if (download) {
    pdf.save(`${sanitizeFilename(project.name)}-equilibrium.pdf`)
  }
  return blob
}

export async function exportProjectToTemplatePng(
  project: Project,
  download = true,
): Promise<Blob> {
  const drawingUrl = renderDrawingToDataUrl(project.shapes)
  const canvas = await renderTemplateCanvas(project, drawingUrl)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b)
      else reject(new Error('Falha ao gerar PNG'))
    }, 'image/png')
  })

  if (download) {
    downloadBlob(blob, `${sanitizeFilename(project.name)}-equilibrium.png`)
  }
  return blob
}
