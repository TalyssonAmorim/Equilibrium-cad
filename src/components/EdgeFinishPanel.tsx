import { useCanvasStore } from '../store/canvasStore'
import {
  EDGE_FINISH_CATALOG,
  EDGE_FINISH_VIEWBOX,
} from '../types/edgeFinish'

export function EdgeFinishPanel() {
  const selected = useCanvasStore((s) => s.selectedEdgeFinish)
  const setSelected = useCanvasStore((s) => s.setSelectedEdgeFinish)
  const setShapesPanelOpen = useCanvasStore((s) => s.setShapesPanelOpen)
  const setActiveTool = useCanvasStore((s) => s.setActiveTool)

  return (
    <aside className="fixed left-4 top-20 z-30 flex w-72 flex-col rounded-2xl border border-surface-border bg-surface-elevated shadow-xl">
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide text-text">
            Acabamentos
          </h2>
          <p className="text-[10px] text-text-muted">Borda · arraste no croqui</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShapesPanelOpen(false)
            setActiveTool('select')
          }}
          className="rounded-lg px-2 py-1 text-lg text-text-muted active:bg-surface-border"
          aria-label="Fechar painel"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 overflow-y-auto p-3 max-h-96">
        {EDGE_FINISH_CATALOG.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(item.id)}
            className={`flex flex-col items-center rounded-xl border p-2 transition-colors ${
              selected === item.id
                ? 'border-accent bg-accent/15'
                : 'border-surface-border bg-surface active:bg-surface-border'
            }`}
          >
            <svg
              viewBox={`0 0 ${EDGE_FINISH_VIEWBOX.width} ${EDGE_FINISH_VIEWBOX.height}`}
              className="h-12 w-full"
              aria-hidden
            >
              <path
                d={item.path}
                fill="rgba(51, 65, 85, 0.15)"
                stroke="#334155"
                strokeWidth={2}
              />
            </svg>
            <span
              className={`mt-1.5 text-center text-[9px] font-medium leading-tight ${
                selected === item.id ? 'text-accent' : 'text-text-muted'
              }`}
            >
              {item.shortLabel}
            </span>
          </button>
        ))}
      </div>

      <p className="border-t border-surface-border px-4 py-2 text-[10px] text-text-muted">
        Selecionado:{' '}
        <strong className="text-text">
          {EDGE_FINISH_CATALOG.find((c) => c.id === selected)?.label}
        </strong>
      </p>
    </aside>
  )
}
