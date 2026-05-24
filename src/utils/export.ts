import { jsPDF } from 'jspdf'
import type Konva from 'konva'

export async function exportStageToPng(
  stage: Konva.Stage,
  pixelRatio = 2,
): Promise<Blob> {
  const dataUrl = stage.toDataURL({ pixelRatio })
  const res = await fetch(dataUrl)
  return res.blob()
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportStageToPdf(
  stage: Konva.Stage,
  projectName: string,
  pixelRatio = 2,
): Promise<void> {
  const dataUrl = stage.toDataURL({ pixelRatio })
  const width = stage.width()
  const height = stage.height()
  const orientation = width > height ? 'landscape' : 'portrait'
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [width, height],
  })
  pdf.addImage(dataUrl, 'PNG', 0, 0, width, height)
  pdf.setProperties({ title: projectName })
  pdf.save(`${sanitizeFilename(projectName)}.pdf`)
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w\s-]/g, '').trim() || 'projeto'
}
