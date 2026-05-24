import { useCanvasStore } from '../store/canvasStore'
import { useProjectStore } from '../store/projectStore'
import { TOOLS } from '../types/tools'

const TOP_TOOL_IDS = ['line', 'pen', 'rect', 'circle']

export function FloatingToolbar() {
  const undo = useProjectStore((s) => s.undo)
  const undoCount = useProjectStore((s) => s.undoStack.length)
  const project = useProjectStore((s) => s.project)
  const activeTool = useCanvasStore((s) => s.activeTool)
  const setActiveTool = useCanvasStore((s) => s.setActiveTool)

  const topTools = TOOLS.filter((tool) => TOP_TOOL_IDS.includes(tool.id))

  return (
    <div className="fixed top-20 left-1/2 z-30 -translate-x-1/2 flex items-center gap-1 rounded-full border border-surface-border bg-surface-elevated/95 px-2 py-1.5 shadow-lg backdrop-blur-sm">
      <button
        type="button"
        disabled={!project || undoCount === 0}
        onClick={() => undo()}
        title="Desfazer (Ctrl+Z)"
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-text-muted transition-all hover:bg-surface active:bg-surface-border disabled:opacity-30"
      >
        ↶
      </button>

      <div className="mx-1 h-5 w-px bg-surface-border" />

      {topTools.map((tool) => {
        const isActive = activeTool === tool.id

        return (
          <button
            key={tool.id}
            type="button"
            title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
            onClick={() => setActiveTool(tool.id)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition-all ${
              isActive
                ? 'bg-accent/25 text-accent'
                : 'text-text-muted hover:bg-surface active:bg-surface-border'
            }`}
          >
            <span aria-hidden>{tool.icon}</span>
          </button>
        )
      })}
    </div>
  )
}
