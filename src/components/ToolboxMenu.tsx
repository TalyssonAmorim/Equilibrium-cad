import { useRef } from 'react'
import { useCanvasStore } from '../store/canvasStore'
import { useProjectStore } from '../store/projectStore'
import { TOOLS } from '../types/tools'
import type { ToolId } from '../types/tools'

const TOP_TOOL_IDS = ['line', 'pen', 'lshape', 'rect', 'circle']

export function ToolboxMenu() {
  const activeTool = useCanvasStore((s) => s.activeTool)
  const setActiveTool = useCanvasStore((s) => s.setActiveTool)
  const rodaBancaHeightCm = useCanvasStore((s) => s.rodaBancaHeightCm)
  const setRodaBancaHeight = useCanvasStore((s) => s.setRodaBancaHeight)
  const toolboxOpen = useCanvasStore((s) => s.toolboxOpen)
  const setToolboxOpen = useCanvasStore((s) => s.setToolboxOpen)
  const undo = useProjectStore((s) => s.undo)
  const undoCount = useProjectStore((s) => s.undoStack.length)
  const project = useProjectStore((s) => s.project)
  const visibleTools = TOOLS.filter(
    (tool) => !TOP_TOOL_IDS.includes(tool.id),
  )
  const longPressTimer = useRef<number | null>(null)

  const handleLongPress = (toolId: string) => {
    if (toolId !== 'roda-banca') return
    const value = prompt(
      'Altura da roda-banca em cm',
      rodaBancaHeightCm.toString(),
    )
    if (!value) return
    const parsed = Number(value)
    if (!Number.isNaN(parsed) && parsed > 0) {
      setRodaBancaHeight(parsed)
    }
  }
  return (
    <>
      {/* Botão flutuante quando fechado */}
      {!toolboxOpen && (
        <button
          type="button"
          onClick={() => setToolboxOpen(true)}
          className="fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-xl bg-accent shadow-lg transition-all active:scale-95 hover:shadow-xl"
          title="Abrir ferramentas"
        >
          <span className="text-xl text-white">⋮</span>
        </button>
      )}

      {/* Menu flutuante expandido */}
      {toolboxOpen && (
        <aside className="fixed left-4 bottom-4 z-40 flex w-[72px] flex-col rounded-2xl border border-surface-border bg-surface-elevated shadow-xl">
          <div className="flex flex-col gap-1 p-2">
            {visibleTools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
                onPointerDown={() => {
                  if (tool.id === 'roda-banca') {
                    longPressTimer.current = window.setTimeout(
                      () => handleLongPress(tool.id),
                      500,
                    )
                  }
                }}
                onPointerUp={() => {
                  if (longPressTimer.current !== null) {
                    window.clearTimeout(longPressTimer.current)
                    longPressTimer.current = null
                  }
                }}
                onPointerLeave={() => {
                  if (longPressTimer.current !== null) {
                    window.clearTimeout(longPressTimer.current)
                    longPressTimer.current = null
                  }
                }}
                onClick={() => setActiveTool(tool.id as ToolId)}
                className={`flex h-[48px] w-[48px] flex-col items-center justify-center rounded-lg text-sm transition-all ${
                  activeTool === tool.id
                    ? 'bg-accent/25 text-accent shadow-sm'
                    : 'text-text-muted hover:bg-surface active:bg-surface-border'
                }`}
              >
                <span aria-hidden className="text-lg">
                  {tool.icon}
                </span>
                <span className="text-[7px] font-medium leading-tight">
                  {tool.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mx-2 my-1.5 h-px bg-surface-border" />

          <div className="flex flex-col gap-1 p-2">
            <button
              type="button"
              title="Desfazer (Ctrl+Z)"
              disabled={!project || undoCount === 0}
              onClick={() => undo()}
              className="flex h-[48px] w-[48px] flex-col items-center justify-center rounded-lg text-sm text-text-muted transition-all hover:bg-surface active:bg-surface-border disabled:opacity-30"
            >
              <span aria-hidden className="text-lg">
                ↶
              </span>
              <span className="text-[7px] font-medium">Desfazer</span>
            </button>

            <button
              type="button"
              onClick={() => setToolboxOpen(false)}
              className="flex h-[48px] w-[48px] flex-col items-center justify-center rounded-lg text-sm text-text-muted transition-all hover:bg-surface active:bg-surface-border"
              title="Fechar menu"
            >
              <span aria-hidden className="text-lg">
                ×
              </span>
              <span className="text-[7px] font-medium">Fechar</span>
            </button>
          </div>
        </aside>
      )}
    </>
  )
}
