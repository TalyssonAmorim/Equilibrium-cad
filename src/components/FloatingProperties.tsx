import { useMemo } from 'react'
import { useCanvasStore } from '../store/canvasStore'
import { useProjectStore } from '../store/projectStore'
import { selectProjectShapes } from '../store/selectors'
import { isEdgeFinishShape } from '../types/shapes'

export function FloatingProperties() {
  const selectedIds = useCanvasStore((s) => s.selectedIds)
  const shapes = useProjectStore(selectProjectShapes)
  const updateShape = useProjectStore((s) => s.updateShape)
  const clearSelection = useCanvasStore((s) => s.clearSelection)

  const selected = useMemo(
    () => shapes.filter((s) => selectedIds.includes(s.id)),
    [shapes, selectedIds],
  )

  const shape = selected.length === 1 ? selected[0] : null
  const lShape =
    shape &&
    shape.type === 'line' &&
    shape.closed &&
    typeof shape.width1 === 'number' &&
    typeof shape.width2 === 'number' &&
    typeof shape.height1 === 'number' &&
    typeof shape.height2 === 'number'
      ? shape
      : null
  const dimensionShape =
    shape && 'width' in shape && 'height' in shape && !isEdgeFinishShape(shape) ? shape : null
  const width = dimensionShape?.width
  const height = dimensionShape?.height
  const material = (shape?.metadata.material as string) ?? ''

  if (selectedIds.length === 0) return null

  return (
    <aside className="fixed right-4 top-16 z-30 max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-surface-border bg-surface-elevated shadow-xl sm:w-60">
      <div className="border-b border-surface-border px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Propriedades
          </h2>
          <button
            type="button"
            onClick={() => clearSelection()}
            className="rounded px-2 py-1 text-sm text-text-muted transition hover:bg-surface active:bg-surface-border"
            aria-label="Fechar painel"
          >
            ×
          </button>
        </div>
      </div>

      <div className="p-4 text-sm">
        {!shape && (
          <p className="text-text-muted">
            {selectedIds.length > 1
              ? `${selectedIds.length} objetos selecionados`
              : 'Selecione um objeto no canvas'}
          </p>
        )}

        {shape && lShape && (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs text-text-muted">
              Largura do lado 1
              <input
                type="number"
                value={lShape.width1}
                className="mt-1 w-full min-h-11 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text"
                onChange={(e) =>
                  updateShape(shape.id, { width1: Number(e.target.value) })
                }
              />
            </label>

            <label className="block text-xs text-text-muted">
              Largura do lado 2
              <input
                type="number"
                value={lShape.width2}
                className="mt-1 w-full min-h-11 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text"
                onChange={(e) =>
                  updateShape(shape.id, { width2: Number(e.target.value) })
                }
              />
            </label>

            <label className="block text-xs text-text-muted">
              Altura do lado 1
              <input
                type="number"
                value={lShape.height1}
                className="mt-1 w-full min-h-11 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text"
                onChange={(e) =>
                  updateShape(shape.id, { height1: Number(e.target.value) })
                }
              />
            </label>

            <label className="block text-xs text-text-muted">
              Altura do lado 2
              <input
                type="number"
                value={lShape.height2}
                className="mt-1 w-full min-h-11 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text"
                onChange={(e) =>
                  updateShape(shape.id, { height2: Number(e.target.value) })
                }
              />
            </label>

            <label className="block text-xs text-text-muted sm:col-span-2">
              Material
              <input
                className="mt-1 w-full min-h-11 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text"
                value={material}
                placeholder="Ex: Granito Preto"
                onChange={(e) =>
                  updateShape(shape.id, {
                    metadata: { ...shape.metadata, material: e.target.value },
                  })
                }
              />
            </label>
          </div>
        )}

        {shape && !lShape && dimensionShape && (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs text-text-muted">
              Altura
              <input
                type="number"
                value={height}
                className="mt-1 w-full min-h-11 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text"
                onChange={(e) =>
                  updateShape(shape.id, { height: Number(e.target.value) })
                }
              />
            </label>

            <label className="block text-xs text-text-muted">
              Largura
              <input
                type="number"
                value={width}
                className="mt-1 w-full min-h-11 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text"
                onChange={(e) =>
                  updateShape(shape.id, { width: Number(e.target.value) })
                }
              />
            </label>

            <label className="block text-xs text-text-muted sm:col-span-2">
              Material
              <input
                className="mt-1 w-full min-h-11 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text"
                value={material}
                placeholder="Ex: Granito Preto"
                onChange={(e) =>
                  updateShape(shape.id, {
                    metadata: { ...shape.metadata, material: e.target.value },
                  })
                }
              />
            </label>
          </div>
        )}

        {shape && !dimensionShape && !lShape && (
          <p className="text-sm text-text-muted">
            Este objeto não possui campos editáveis de altura, largura e material.
          </p>
        )}

        {shape && isEdgeFinishShape(shape) && (
          <div className="space-y-3">
            <label className="block text-xs text-text-muted">
              Medida: {Math.round(1 + (shape.range ?? 0) * 49)} cm
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={Math.round(1 + (shape.range ?? 0) * 49)}
                  onChange={(e) => {
                    const cm = Number(e.target.value)
                    const normalized = Math.min(1, Math.max(0, (cm - 1) / 49))
                    updateShape(shape.id, { range: normalized })
                  }}
                  className="w-full cursor-pointer flex-1"
                />
                <span className="text-xs text-text-muted w-10 text-right">
                  {Math.round(1 + (shape.range ?? 0) * 49)}cm
                </span>
              </div>
            </label>
          </div>
        )}
      </div>
    </aside>
  )
}
