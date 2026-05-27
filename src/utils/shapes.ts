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
import { distanceCm, generateId } from './geometry'
import { getComponentDefinition } from '../types/components'

export function createLineShape(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  points?: number[],
  closed?: boolean,
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
    closed,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    stroke: DEFAULT_STROKE,
    metadata: { createdAt: new Date().toISOString() },
  }
}

export function createRodaBancaPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  height: number,
): number[] {
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.hypot(dx, dy) || 1
  const nx = dx / length
  const ny = dy / length
  const perpX = -ny
  const perpY = nx
  const halfHeight = height / 2

  const backLeftX = x1 + perpX * halfHeight
  const backLeftY = y1 + perpY * halfHeight
  const backRightX = x1 - perpX * halfHeight
  const backRightY = y1 - perpY * halfHeight

  const tipCenterX = x2 - nx * halfHeight
  const tipCenterY = y2 - ny * halfHeight
  const tipLeftX = tipCenterX + perpX * halfHeight
  const tipLeftY = tipCenterY + perpY * halfHeight
  const tipRightX = tipCenterX - perpX * halfHeight
  const tipRightY = tipCenterY - perpY * halfHeight

  return [
    backLeftX,
    backLeftY,
    backRightX,
    backRightY,
    tipRightX,
    tipRightY,
    x2,
    y2,
    tipLeftX,
    tipLeftY,
  ]
}

export function createRodaBancaShape(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  height: number,
): LineShape {
  const points = createRodaBancaPoints(x1, y1, x2, y2, height)
  return {
    ...createLineShape(x1, y1, x2, y2, points, true),
    width: Math.hypot(x2 - x1, y2 - y1),
    height,
    metadata: { createdAt: new Date().toISOString() },
  }
}

export function createLShapePoints(
  x: number,
  y: number,
  width1: number,
  height1: number,
  width2: number,
  height2: number,
  orientation: ComponentOrientation,
): number[] {
  const pointsByOrientation: Record<ComponentOrientation, number[]> = {
    'top-left': [
      x,
      y,
      x + width1,
      y,
      x + width1,
      y + height2,
      x + width2,
      y + height2,
      x + width2,
      y + height1,
      x,
      y + height1,
    ],
    'top-right': [
      x,
      y,
      x + width1,
      y,
      x + width1,
      y + height1,
      x + width1 - width2,
      y + height1,
      x + width1 - width2,
      y + height2,
      x,
      y + height2,
    ],
    'bottom-left': [
      x,
      y,
      x + width2,
      y,
      x + width2,
      y + height1 - height2,
      x + width1,
      y + height1 - height2,
      x + width1,
      y + height1,
      x,
      y + height1,
    ],
    'bottom-right': [
      x,
      y,
      x + width1,
      y,
      x + width1,
      y + height1 - height2,
      x + width1 - width2,
      y + height1 - height2,
      x + width1 - width2,
      y + height1,
      x,
      y + height1,
    ],
  }

  return pointsByOrientation[orientation]
}

export function createLShape(
  x: number,
  y: number,
  width1: number,
  height1: number,
  width2: number,
  height2: number,
  orientation: ComponentOrientation,
): LineShape {
  const points = createLShapePoints(
    x,
    y,
    width1,
    height1,
    width2,
    height2,
    orientation,
  )
  return {
    ...createLineShape(x, y, x + width1, y + height1, points, true),
    x,
    y,
    width: width1,
    height: height1,
    width1,
    width2,
    height1,
    height2,
    orientation,
  }
}

export function normalizeShape(shape: Shape): Shape {
  if (
    shape.type === 'line' &&
    shape.closed &&
    typeof shape.x === 'number' &&
    typeof shape.y === 'number' &&
    typeof shape.width1 === 'number' &&
    typeof shape.height1 === 'number' &&
    typeof shape.width2 === 'number' &&
    typeof shape.height2 === 'number' &&
    shape.orientation
  ) {
    let x = shape.x
    let y = shape.y
    let width1 = shape.width1
    let height1 = shape.height1
    let width2 = shape.width2
    let height2 = shape.height2

    if (width1 < 0) {
      x += width1
      width1 = Math.abs(width1)
    }
    if (height1 < 0) {
      y += height1
      height1 = Math.abs(height1)
    }

    width2 = Math.max(5, Math.min(width2, width1 - 5))
    height2 = Math.max(5, Math.min(height2, height1 - 5))

    const points = createLShapePoints(
      x,
      y,
      width1,
      height1,
      width2,
      height2,
      shape.orientation,
    )
    return {
      ...shape,
      x,
      y,
      width: width1,
      height: height1,
      width1,
      width2,
      height1,
      height2,
      points,
      x1: x,
      y1: y,
      x2: x + width1,
      y2: y + height1,
    }
  }

  return shape
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
  const valueCm = distanceCm({ x: x1, y: y1 }, { x: x2, y: y2 })
  return {
    id: generateId(),
    type: 'measurement',
    layer: 'measurement',
    x1,
    y1,
    x2,
    y2,
    valueMm: valueCm,
    label: `${Math.round(valueCm)} cm`,
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
