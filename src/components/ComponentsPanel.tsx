import { COMPONENT_LIBRARY } from '../types/components'
import { useCanvasStore } from '../store/canvasStore'

export function ComponentsPanel() {
  const selected = useCanvasStore((s) => s.selectedComponent)
  const setSelected = useCanvasStore((s) => s.setSelectedComponent)
  const setComponentPanelOpen = useCanvasStore((s) => s.setComponentPanelOpen)
  const setActiveTool = useCanvasStore((s) => s.setActiveTool)

  return (
    <aside className="fixed left-4 top-20 z-30 flex w-72 flex-col rounded-2xl border border-surface-border bg-surface-elevated shadow-xl">
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide text-text">
            Componentes
          </h2>
          <p className="text-[10px] text-text-muted">Arraste para o croqui ou clique para posicionar</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setComponentPanelOpen(false)
            setActiveTool('select')
          }}
          className="rounded-lg px-2 py-1 text-lg text-text-muted active:bg-surface-border"
          aria-label="Fechar painel"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 overflow-y-auto p-3 max-h-96">
        {COMPONENT_LIBRARY.map((item) => (
          <button
            key={item.id}
            type="button"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/component', item.id)
            }}
            onClick={() => {
              setSelected(item.id)
              setActiveTool('component')
            }}
            className={`flex flex-col items-center rounded-xl border p-2 transition-colors ${
              selected === item.id
                ? 'border-accent bg-accent/15'
                : 'border-surface-border bg-surface active:bg-surface-border'
            }`}
          >
            <div
              className="h-12 w-full"
              dangerouslySetInnerHTML={{
                __html: `<svg viewBox='0 0 800 600' xmlns='http://www.w3.org/2000/svg'>${item.icon}</svg>`,
              }}
            />
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
    </aside>
  )
}
