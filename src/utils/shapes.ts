import type { EdgeFinishType } from '../types/edgeFinish'
import { getEdgeFinishDefinition } from '../types/edgeFinish'
import type { ComponentType } from '../types/components'
import type {
  CircleShape,
  ComponentOrientation,
  ComponentShape,
  EdgeFinishShape,
  LineShape,
  MeasurementShape,
  RectShape,
  Shape,
} from '../types/shapes'
import {
  DEFAULT_FILL,
  DEFAULT_STROKE,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_TEXT_FONT_SIZE,
} from './constants'
import { distanceMm, generateId } from './geometry'
import { getComponentDefinition } from '../types/components'

export function createLineShape(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  points?: number[],
): LineShape {
  return {
    id: generateId(),
    type: 'line',
    layer: 'drawing',
    x1,
    y1,
    x2,
    y2,
    points: points ?? [x1, y1, x2, y2],
    strokeWidth: DEFAULT_STROKE_WIDTH,
    stroke: DEFAULT_STROKE,
    metadata: { createdAt: new Date().toISOString() },
  }
}

export function createRectShape(
  x: number,
  y: number,
  width: number,
  height: number,
): RectShape {
  return {
    id: generateId(),
    type: 'rect',
    layer: 'drawing',
    x,
    y,
    width,
    height,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    stroke: DEFAULT_STROKE,
    fill: DEFAULT_FILL,
    metadata: { createdAt: new Date().toISOString() },
  }
}

export function createCircleShape(
  cx: number,
  cy: number,
  radius: number,
): CircleShape {
  return {
    id: generateId(),
    type: 'circle',
    layer: 'drawing',
    cx,
    cy,
    radius,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    stroke: DEFAULT_STROKE,
    fill: DEFAULT_FILL,
    metadata: { createdAt: new Date().toISOString() },
  }
}

export function createEdgeFinishShape(
  x: number,
  y: number,
  width: number,
  height: number,
  edgeType: EdgeFinishType,
): EdgeFinishShape {
  const def = getEdgeFinishDefinition(edgeType)
  return {
    id: generateId(),
    type: 'edgeFinish',
    layer: 'drawing',
    x,
    y,
    width,
    height,
    edgeType,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    stroke: DEFAULT_STROKE,
    fill: DEFAULT_FILL,
    metadata: {
      createdAt: new Date().toISOString(),
      label: def.label,
      edgeFinishType: edgeType,
    },
  }
}

export function createComponentShape(
  x: number,
  y: number,
  width: number,
  height: number,
  componentType: ComponentType,
  params?: { thickness?: number; orientation?: ComponentOrientation },
): ComponentShape {
  const definition = getComponentDefinition(componentType)
  const baseThickness = Math.min(width, height) * 0.25
  const thickness = Math.min(
    Math.max(params?.thickness ?? baseThickness, 20),
    Math.min(width, height) / 2,
  )
  const orientation = params?.orientation ?? 'top-left'

  return {
    id: generateId(),
    type: 'component',
    layer: 'drawing',
    x,
    y,
    width,
    height,
    componentType,
    rotation: 0,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    stroke: definition.strokeColor,
    fill: definition.fillColor,
    params: {
      thickness,
      orientation,
    },
    metadata: {
      createdAt: new Date().toISOString(),
      label: definition.label,
    },
  }
}

export function createMeasurementForLine(line: LineShape): MeasurementShape {
  const points = line.points ?? [line.x1, line.y1, line.x2, line.y2]
  const x1 = points[0] ?? line.x1
  const y1 = points[1] ?? line.y1
  const x2 = points[points.length - 2] ?? line.x2
  const y2 = points[points.length - 1] ?? line.y2
  const valueMm = distanceMm({ x: x1, y: y1 }, { x: x2, y: y2 })
  return {
    id: generateId(),
    type: 'measurement',
    layer: 'measurement',
    x1,
    y1,
    x2,
    y2,
    valueMm,
    label: `${Math.round(valueMm)} mm`,
    sourceShapeId: line.id,
    metadata: {},
  }
}

export function createTextShape(x: number, y: number, text: string): Shape {
  return {
    id: generateId(),
    type: 'text',
    layer: 'drawing',
    x,
    y,
    text,
    fontSize: DEFAULT_TEXT_FONT_SIZE,
    fill: DEFAULT_STROKE,
    metadata: { createdAt: new Date().toISOString() },
  }
}

export function getComponentInitialSize(componentType: ComponentType) {
  if (componentType.startsWith('cuba_') || componentType.startsWith('cooktop_')) {
    return { width: 40, height: 40 }
  }

  const definition = getComponentDefinition(componentType)
  return { width: definition.width, height: definition.height }
}

export function getShapeBounds(shape: Shape): {
  minX: number
  minY: number
  maxX: number
  maxY: number
} | null {
  switch (shape.type) {
    case 'line':
    case 'measurement': {
      const points = shape.type === 'line' ? shape.points ?? [shape.x1, shape.y1, shape.x2, shape.y2] : [shape.x1, shape.y1, shape.x2, shape.y2]
      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity

      for (let i = 0; i < points.length; i += 2) {
        const pointX = points[i]
        const pointY = points[i + 1]
        if (pointX === undefined || pointY === undefined) continue
        minX = Math.min(minX, pointX)
        minY = Math.min(minY, pointY)
        maxX = Math.max(maxX, pointX)
        maxY = Math.max(maxY, pointY)
      }

      return { minX, minY, maxX, maxY }
    }
    case 'rect':
    case 'edgeFinish':
    case 'component':
      return {
        minX: shape.x,
        minY: shape.y,
        maxX: shape.x + shape.width,
        maxY: shape.y + shape.height,
      }
    case 'circle':
      return {
        minX: shape.cx - shape.radius,
        minY: shape.cy - shape.radius,
        maxX: shape.cx + shape.radius,
        maxY: shape.cy + shape.radius,
      }
    case 'text':
      return {
        minX: shape.x,
        minY: shape.y,
        maxX: shape.x + 100,
        maxY: shape.y + shape.fontSize,
      }
    default:
      return null
  }
}
