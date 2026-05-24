import type { Shape } from '../types/shapes'
import { getShapeBounds } from './shapes'

export type BoxHandle =
  | 'nw'
  | 'n'
  | 'ne'
  | 'e'
  | 'se'
  | 's'
  | 'sw'
  | 'w'

export type LineHandle = 'line-start' | 'line-end'
export type RotateHandle = 'rotate'

export type ResizeHandle = BoxHandle | LineHandle | RotateHandle

export interface HandlePosition {
  id: ResizeHandle
  x: number
  y: number
}

const MIN_SIZE_MM = 5
const MIN_RADIUS_MM = 5

export function getResizeHandles(shape: Shape): HandlePosition[] {
  if (shape.type === 'line') {
    return [
      { id: 'line-start', x: shape.x1, y: shape.y1 },
      { id: 'line-end', x: shape.x2, y: shape.y2 },
    ]
  }

  const bounds = getShapeBounds(shape)
  if (!bounds) return []

  const { minX, minY, maxX, maxY } = bounds
  const mx = (minX + maxX) / 2
  const my = (minY + maxY) / 2

  return [
    { id: 'nw', x: minX, y: minY },
    { id: 'n', x: mx, y: minY },
    { id: 'ne', x: maxX, y: minY },
    { id: 'e', x: maxX, y: my },
    { id: 'se', x: maxX, y: maxY },
    { id: 's', x: mx, y: maxY },
    { id: 'sw', x: minX, y: maxY },
    { id: 'w', x: minX, y: my },
  ]
}

export function getRotateHandle(shape: Shape): HandlePosition | null {
  if (shape.type === 'line') return null
  const bounds = getShapeBounds(shape)
  if (!bounds) return null

  return {
    id: 'rotate',
    x: (bounds.minX + bounds.maxX) / 2,
    y: bounds.minY - 20,
  }
}

export function hitTestResizeHandle(
  worldX: number,
  worldY: number,
  shape: Shape,
  toleranceMm: number,
): ResizeHandle | null {
  for (const h of getResizeHandles(shape)) {
    if (Math.hypot(worldX - h.x, worldY - h.y) <= toleranceMm) {
      return h.id
    }
  }

  const rotateHandle = getRotateHandle(shape)
  if (rotateHandle && Math.hypot(worldX - rotateHandle.x, worldY - rotateHandle.y) <= toleranceMm) {
    return rotateHandle.id
  }

  return null
}

export function applyResize(
  initial: Shape,
  handle: ResizeHandle,
  worldX: number,
  worldY: number,
): Partial<Shape> | null {
  if (handle === 'rotate') {
    return applyRotate(initial, worldX, worldY)
  }

  switch (initial.type) {
    case 'rect':
    case 'edgeFinish':
    case 'component':
      return resizeRect(initial, handle as BoxHandle, worldX, worldY)
    case 'circle':
      return resizeCircle(initial, handle as BoxHandle, worldX, worldY)
    case 'line':
      return resizeLine(initial, handle as LineHandle, worldX, worldY)
    default:
      return null
  }
}

function applyRotate(
  shape: Shape,
  worldX: number,
  worldY: number,
): Partial<Shape> | null {
  if (shape.type === 'line') return null
  const bounds = getShapeBounds(shape)
  if (!bounds) return null

  const centerX = (bounds.minX + bounds.maxX) / 2
  const centerY = (bounds.minY + bounds.maxY) / 2
  const angle = (Math.atan2(worldY - centerY, worldX - centerX) * 180) / Math.PI
  return { rotation: Math.round(angle) }
}

function resizeRect(
  shape: { x: number; y: number; width: number; height: number },
  handle: BoxHandle,
  wx: number,
  wy: number,
): Partial<{ x: number; y: number; width: number; height: number }> {
  let { x, y, width, height } = shape
  const right = x + width
  const bottom = y + height

  switch (handle) {
    case 'nw':
      x = wx
      y = wy
      width = right - wx
      height = bottom - wy
      break
    case 'n':
      y = wy
      height = bottom - wy
      break
    case 'ne':
      y = wy
      width = wx - x
      height = bottom - wy
      break
    case 'e':
      width = wx - x
      break
    case 'se':
      width = wx - x
      height = wy - y
      break
    case 's':
      height = wy - y
      break
    case 'sw':
      x = wx
      width = right - wx
      height = wy - y
      break
    case 'w':
      x = wx
      width = right - wx
      break
  }

  if (width < 0) {
    x += width
    width = -width
  }
  if (height < 0) {
    y += height
    height = -height
  }

  width = Math.max(MIN_SIZE_MM, width)
  height = Math.max(MIN_SIZE_MM, height)

  return { x, y, width, height }
}

function resizeCircle(
  shape: Extract<Shape, { type: 'circle' }>,
  handle: BoxHandle,
  wx: number,
  wy: number,
): Partial<Shape> {
  const { cx, cy } = shape
  let radius: number
  if (handle === 'e' || handle === 'w') {
    radius = Math.abs(wx - cx)
  } else if (handle === 'n' || handle === 's') {
    radius = Math.abs(wy - cy)
  } else {
    radius = Math.hypot(wx - cx, wy - cy)
  }
  return { radius: Math.max(MIN_RADIUS_MM, radius) }
}

function resizeLine(
  _shape: Extract<Shape, { type: 'line' }>,
  handle: LineHandle,
  wx: number,
  wy: number,
): Partial<Shape> {
  if (handle === 'line-start') {
    return { x1: wx, y1: wy }
  }
  return { x2: wx, y2: wy }
}
