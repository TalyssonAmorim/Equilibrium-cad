import { useMemo, type ReactNode } from 'react'
import { useCanvasStore } from '../store/canvasStore'
import { useProjectStore } from '../store/projectStore'
import { selectProjectShapes } from '../store/selectors'
import { formatCm } from '../utils/geometry'
import {
  isCircleShape,
  isEdgeFinishShape,
  isLineShape,
  isRectShape,
  type ComponentOrientation,
  type LineShape,
  type Shape,
} from '../types/shapes'
import { getEdgeFinishDefinition } from '../types/edgeFinish'
import { ProjectFieldsPanel } from './ProjectFieldsPanel'

function isLShapeLine(shape: Shape): shape is LineShape & {
  closed: true
  width1: number
  width2: number
  height1: number
  height2: number
  orientation: ComponentOrientation
  x: number
  y: number
} {
  return (
    isLineShape(shape) &&
    shape.closed === true &&
    typeof shape.width1 === 'number' &&
    typeof shape.width2 === 'number' &&
    typeof shape.height1 === 'number' &&
    typeof shape.height2 === 'number' &&
    typeof shape.orientation === 'string' &&
    typeof shape.x === 'number' &&
    typeof shape.y === 'number'
  )
}

function flipOrientationX(orientation: ComponentOrientation): ComponentOrientation {
  switch (orientation) {
    case 'top-left':
      return 'bottom-left'
    case 'top-right':
      return 'bottom-right'
    case 'bottom-left':
      return 'top-left'
    case 'bottom-right':
      return 'top-right'
  }
}

export function PropertiesPanel() {
  const selectedIds = useCanvasStore((s) => s.selectedIds)
  const shapes = useProjectStore(selectProjectShapes)
  const updateShape = useProjectStore((s) => s.updateShape)
  const removeShapes = useProjectStore((s) => s.removeShapes)
  const camera = useCanvasStore((s) => s.camera)

  const selected = useMemo(
    () => shapes.filter((s) => selectedIds.includes(s.id)),
    [shapes, selectedIds],
  )

  const shape = selected.length === 1 ? selected[0] : null

  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-l border-surface-border bg-surface-elevated">
      <div className="border-b border-surface-border px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          Propriedades
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 text-sm">
        <ProjectFieldsPanel />

        <section className="mb-4 rounded-lg bg-surface p-3">
          <p className="text-xs text-text-muted">Câmera</p>
          <p className="mt-1 font-mono text-xs text-text">
            Centro: {formatCm(camera.x, 1)}, {formatCm(camera.y, 1)}
          </p>
          <p className="font-mono text-xs text-text">
            Zoom: {(camera.scale / 2.5 * 100).toFixed(0)}%
          </p>
        </section>

        {!shape && (
          <p className="text-text-muted">
            {selectedIds.length > 1
              ? `${selectedIds.length} objetos selecionados`
              : 'Selecione um objeto no canvas'}
          </p>
        )}

        {shape && isLShapeLine(shape) && (
          <ShapeEditor
            title="Polígono em L"
            onDelete={() => removeShapes([shape.id])}
          >
            <label className="block text-xs text-text-muted">
              Largura do lado 1
              <input
                type="number"
                className="mt-1 w-full min-h-11 rounded-lg border border-surface-border bg-surface px-3 text-sm"
                value={shape.width1}
                onChange={(e) =>
                  updateShape(shape.id, {
                    width1: Number(e.target.value),
                  })
                }
              />
            </label>
            <label className="block text-xs text-text-muted">
              Largura do lado 2
              <input
                type="number"
                className="mt-1 w-full min-h-11 rounded-lg border border-surface-border bg-surface px-3 text-sm"
                value={shape.width2}
                onChange={(e) =>
                  updateShape(shape.id, {
                    width2: Number(e.target.value),
                  })
                }
              />
            </label>
            <label className="block text-xs text-text-muted">
              Altura do lado 1
              <input
                type="number"
                className="mt-1 w-full min-h-11 rounded-lg border border-surface-border bg-surface px-3 text-sm"
                value={shape.height1}
                onChange={(e) =>
                  updateShape(shape.id, {
                    height1: Number(e.target.value),
                  })
                }
              />
            </label>
            <label className="block text-xs text-text-muted">
              Altura do lado 2
              <input
                type="number"
                className="mt-1 w-full min-h-11 rounded-lg border border-surface-border bg-surface px-3 text-sm"
                value={shape.height2}
                onChange={(e) =>
                  updateShape(shape.id, {
                    height2: Number(e.target.value),
                  })
                }
              />
            </label>
            <button
              type="button"
              onClick={() =>
                updateShape(shape.id, {
                  orientation: flipOrientationX(shape.orientation),
                })
              }
              className="mt-3 min-h-11 w-full rounded-lg border border-surface-border bg-surface px-3 text-sm transition hover:bg-surface-border"
            >
              Inverter no eixo X
            </button>
          </ShapeEditor>
        )}

        {shape && isLineShape(shape) && !isLShapeLine(shape) && (
          <ShapeEditor
            title="Linha"
            onDelete={() => removeShapes([shape.id])}
          >
            <Field label="Comprimento" value={formatCm(
              Math.hypot(shape.x2 - shape.x1, shape.y2 - shape.y1),
            )} />
            <Field label="Início" value={`${shape.x1} cm, ${shape.y1} cm`} />
            <Field label="Fim" value={`${shape.x2} cm, ${shape.y2} cm`} />
            <label className="mt-2 block text-xs text-text-muted">
              Notas
              <textarea
                className="mt-1 w-full rounded-lg border border-surface-border bg-surface p-2 text-sm text-text"
                rows={3}
                value={(shape.metadata.notes as string) ?? ''}
                onChange={(e) =>
                  updateShape(shape.id, {
                    metadata: { ...shape.metadata, notes: e.target.value },
                  })
                }
              />
            </label>
          </ShapeEditor>
        )}

        {shape && isRectShape(shape) && (
          <ShapeEditor
            title="Retângulo (bancada)"
            onDelete={() => removeShapes([shape.id])}
          >
            <Field label="Posição" value={`${shape.x} cm, ${shape.y} cm`} />
            <Field label="Largura" value={formatCm(shape.width)} />
            <Field label="Profundidade" value={formatCm(shape.height)} />
            <Field
              label="Área"
              value={formatCm(shape.width * shape.height)}
            />
            <label className="mt-2 block text-xs text-text-muted">
              Material
              <input
                className="mt-1 w-full min-h-11 rounded-lg border border-surface-border bg-surface px-3 text-sm"
                value={(shape.metadata.material as string) ?? ''}
                placeholder="Ex: Granito Preto"
                onChange={(e) =>
                  updateShape(shape.id, {
                    metadata: { ...shape.metadata, material: e.target.value },
                  })
                }
              />
            </label>
          </ShapeEditor>
        )}

        {shape && isEdgeFinishShape(shape) && (
          <ShapeEditor
            title="Acabamento de borda"
            onDelete={() => removeShapes([shape.id])}
          >
            <Field
              label="Tipo"
              value={getEdgeFinishDefinition(shape.edgeType).label}
            />
            <Field label="Largura" value={formatCm(shape.width)} />
            <Field label="Altura" value={formatCm(shape.height)} />
            <Field
              label="Posição"
              value={`${Math.round(shape.x)} cm, ${Math.round(shape.y)} cm`}
            />
          </ShapeEditor>
        )}

        {shape && isCircleShape(shape) && (
          <ShapeEditor
            title="Círculo"
            onDelete={() => removeShapes([shape.id])}
          >
            <Field
              label="Centro"
              value={`${shape.cx} cm, ${shape.cy} cm`}
            />
            <Field label="Raio" value={formatCm(shape.radius)} />
            <Field
              label="Diâmetro"
              value={formatCm(shape.radius * 2)}
            />
            <p className="text-xs text-text-muted">
              Arraste os pontos amarelos no canvas para redimensionar.
            </p>
          </ShapeEditor>
        )}
      </div>
    </aside>
  )
}

function ShapeEditor({
  title,
  children,
  onDelete,
}: {
  title: string
  children: ReactNode
  onDelete: () => void
}) {
  return (
    <div>
      <h3 className="font-medium text-text">{title}</h3>
      <div className="mt-3 space-y-2">{children}</div>
      <button
        type="button"
        onClick={onDelete}
        className="mt-4 min-h-11 w-full rounded-lg border border-danger/40 text-danger active:bg-danger/10"
      >
        Excluir
      </button>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-text-muted">{label}</span>
      <p className="font-mono text-sm text-text">{value}</p>
    </div>
  )
}
