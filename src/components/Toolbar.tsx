import { useProjectStore } from '../store/projectStore'
import { useCanvasStore } from '../store/canvasStore'
import {
  exportProjectToTemplatePdf,
  exportProjectToTemplatePng,
} from '../utils/templateExport'

interface ToolbarProps {
  onNewProject: () => void
  onOpenProjects: () => void
}

export function Toolbar({ onNewProject, onOpenProjects }: ToolbarProps) {
  const project = useProjectStore((s) => s.project)
  const isDirty = useProjectStore((s) => s.isDirty)
  const isSaving = useProjectStore((s) => s.isSaving)
  const saveCurrentProject = useProjectStore((s) => s.saveCurrentProject)
  const snapEnabled = useCanvasStore((s) => s.snapEnabled)
  const setSnapEnabled = useCanvasStore((s) => s.setSnapEnabled)

  const handleExportPng = async () => {
    if (!project) return
    await exportProjectToTemplatePng(project, true)
  }

  const handleExportPdf = async () => {
    if (!project) return
    await exportProjectToTemplatePdf(project, true)
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-surface-border bg-surface-elevated px-3">
      <button
        type="button"
        onClick={onNewProject}
        className="min-h-11 min-w-11 rounded-lg bg-accent/20 px-3 text-sm font-medium text-accent active:bg-accent/30"
      >
        Novo
      </button>
      <button
        type="button"
        onClick={onOpenProjects}
        className="min-h-11 min-w-11 rounded-lg px-3 text-sm text-text-muted active:bg-surface-border"
      >
        Projetos
      </button>

      <div className="mx-2 h-6 w-px bg-surface-border" />

      <h1 className="truncate text-sm font-semibold text-text">
        {project?.name ?? 'Sem projeto'}
        {isDirty && (
          <span className="ml-1 text-accent" title="Alterações não salvas">
            •
          </span>
        )}
      </h1>

      <div className="flex-1" />

      <label className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-text-muted">
        <input
          type="checkbox"
          checked={snapEnabled}
          onChange={(e) => setSnapEnabled(e.target.checked)}
          className="h-5 w-5 accent-accent"
        />
        Snap 1cm
      </label>

      <button
        type="button"
        disabled={!project || isSaving}
        onClick={() => void saveCurrentProject()}
        className="min-h-11 rounded-lg bg-accent px-4 text-sm font-semibold text-surface disabled:opacity-40 active:opacity-90"
        title="Salva no dispositivo e gera PDF no template Equilibrium"
      >
        {isSaving ? 'Salvando…' : 'Salvar'}
      </button>

      <button
        type="button"
        disabled={!project || isSaving}
        onClick={() => void handleExportPng()}
        className="min-h-11 rounded-lg px-3 text-sm text-text-muted active:bg-surface-border disabled:opacity-40"
        title="PNG com template Equilibrium"
      >
        PNG
      </button>
      <button
        type="button"
        disabled={!project || isSaving}
        onClick={() => void handleExportPdf()}
        className="min-h-11 rounded-lg px-3 text-sm text-text-muted active:bg-surface-border disabled:opacity-40"
        title="PDF com template Equilibrium"
      >
        PDF
      </button>
    </header>
  )
}
