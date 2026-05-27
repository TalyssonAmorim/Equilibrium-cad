import Konva from 'konva'
import { getEdgeFinishDefinition } from '../types/edgeFinish'
import { EDGE_FINISH_VIEWBOX } from '../types/edgeFinish'
import type { Shape } from '../types/shapes'
import { getShapeBounds } from './shapes'

const EXPORT_PX = 720
const PADDING_CM = 2

function addShapeToGroup(group: Konva.Group, shape: Shape) {
  switch (shape.type) {
    case 'line':
      group.add(
        new Konva.Line({
          points: shape.points ?? [shape.x1, shape.y1, shape.x2, shape.y2],
          closed: shape.closed,
          stroke: shape.stroke,
          strokeWidth: shape.strokeWidth,
          lineCap: 'round',
          lineJoin: 'round',
        }),
      )
      break
    case 'rect':
      group.add(
        new Konva.Rect({
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          stroke: shape.stroke,
          strokeWidth: shape.strokeWidth,
          fill: shape.fill,
        }),
      )
      break
    case 'circle':
      group.add(
        new Konva.Circle({
          x: shape.cx,
          y: shape.cy,
          radius: shape.radius,
          stroke: shape.stroke,
          strokeWidth: shape.strokeWidth,
          fill: shape.fill,
        }),
      )
      break
    case 'text':
      group.add(
        new Konva.Text({
          x: shape.x,
          y: shape.y,
          text: shape.text,
          fontSize: shape.fontSize,
          fill: shape.fill,
        }),
      )
      break
    case 'edgeFinish': {
      const def = getEdgeFinishDefinition(shape.edgeType)
      const g = new Konva.Group({ x: shape.x, y: shape.y })
      g.add(
        new Konva.Path({
          data: def.path,
          scaleX: shape.width / EDGE_FINISH_VIEWBOX.width,
          scaleY: shape.height / EDGE_FINISH_VIEWBOX.height,
          fill: shape.fill,
          stroke: shape.stroke,
          strokeWidth: shape.strokeWidth,
        }),
      )
      group.add(g)
      break
    }
    default:
      break
  }
}

/** Renderiza shapes do layer drawing em PNG branco para inserir no template */
export function renderDrawingToDataUrl(shapes: Shape[]): string | null {
  const drawing = shapes.filter((s) => s.layer === 'drawing')
  if (drawing.length === 0) return null

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const s of drawing) {
    const b = getShapeBounds(s)
    if (!b) continue
    minX = Math.min(minX, b.minX)
    minY = Math.min(minY, b.minY)
    maxX = Math.max(maxX, b.maxX)
    maxY = Math.max(maxY, b.maxY)
  }
  if (!Number.isFinite(minX)) return null

  const contentW = maxX - minX + PADDING_CM * 2
  const contentH = maxY - minY + PADDING_CM * 2
  const scale = Math.min(EXPORT_PX / contentW, EXPORT_PX / contentH)
  const offsetX = (EXPORT_PX - (maxX - minX) * scale) / 2 - minX * scale
  const offsetY = (EXPORT_PX - (maxY - minY) * scale) / 2 - minY * scale

  const container = document.createElement('div')
  document.body.appendChild(container)

  const stage = new Konva.Stage({
    container,
    width: EXPORT_PX,
    height: EXPORT_PX,
  })
  const layer = new Konva.Layer()
  stage.add(layer)

  layer.add(
    new Konva.Rect({
      x: 0,
      y: 0,
      width: EXPORT_PX,
      height: EXPORT_PX,
      fill: '#ffffff',
    }),
  )

  const group = new Konva.Group({
    x: offsetX,
    y: offsetY,
    scaleX: scale,
    scaleY: scale,
  })

  for (const shape of drawing) {
    addShapeToGroup(group, shape)
  }

  layer.add(group)
  layer.draw()

  const dataUrl = stage.toDataURL({ pixelRatio: 2 })
  stage.destroy()
  container.remove()
  return dataUrl
}
