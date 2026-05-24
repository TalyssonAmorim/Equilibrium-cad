import { useCanvasStore } from '../store/canvasStore'
import { useProjectStore } from '../store/projectStore'
import { TOOLS } from '../types/tools'
import type { ToolId } from '../types/tools'

export function ToolSidebar() {
  const activeTool = useCanvasStore((s) => s.activeTool)
  const setActiveTool = useCanvasStore((s) => s.setActiveTool)
  const undo = useProjectStore((s) => s.undo)
  const undoCount = useProjectStore((s) => s.undoStack.length)
  const project = useProjectStore((s) => s.project)

  return (
    <aside className="flex w-[72px] shrink-0 flex-col border-r border-surface-border bg-surface-elevated py-2">
      <div className="flex flex-col gap-1">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
            onClick={() => setActiveTool(tool.id as ToolId)}
            className={`mx-1 flex min-h-[52px] min-w-[52px] flex-col items-center justify-center rounded-xl text-lg transition-colors ${
              activeTool === tool.id
                ? 'bg-accent/25 text-accent'
                : 'text-text-muted active:bg-surface-border'
            }`}
          >
            <span aria-hidden>{tool.icon}</span>
            <span className="mt-0.5 max-w-[52px] truncate px-0.5 text-center text-[8px] font-medium leading-tight">
              {tool.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <div className="mx-2 mb-2 h-px bg-surface-border" />

      <button
        type="button"
        title="Desfazer (Ctrl+Z)"
        disabled={!project || undoCount === 0}
        onClick={() => undo()}
        className="mx-1 flex min-h-[52px] min-w-[52px] flex-col items-center justify-center rounded-xl text-lg text-text-muted transition-colors active:bg-surface-border disabled:opacity-30"
      >
        <span aria-hidden>↶</span>
        <span className="mt-0.5 text-[8px] font-medium">Desfazer</span>
      </button>
    </aside>
  )
}
