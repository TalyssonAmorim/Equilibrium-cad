export type LayerName = 'drawing' | 'measurement' | 'ui'

import type { EdgeFinishType } from './edgeFinish'
import type { ComponentType } from './components'

export type ShapeType =
  | 'line'
  | 'rect'
  | 'circle'
  | 'edgeFinish'
  | 'text'
  | 'measurement'
  | 'component'

export interface ShapeMetadata {
  label?: string
  material?: string
  notes?: string
  createdAt?: string
  [key: string]: unknown
}

export interface BaseShape {
  id: string
  type: ShapeType
  layer: LayerName
  metadata: ShapeMetadata
}

export interface LineShape extends BaseShape {
  type: 'line'
  x1: number
  y1: number
  x2: number
  y2: number
  x?: number
  y?: number
  width?: number
  height?: number
  width1?: number
  width2?: number
  height1?: number
  height2?: number
  orientation?: ComponentOrientation
  points?: number[]
  closed?: boolean
  strokeWidth: number
  stroke: string
}

export interface RectShape extends BaseShape {
  type: 'rect'
  x: number
  y: number
  width: number
  height: number
  strokeWidth: number
  stroke: string
  fill: string
}

export interface CircleShape extends BaseShape {
  type: 'circle'
  cx: number
  cy: number
  radius: number
  strokeWidth: number
  stroke: string
  fill: string
}

export interface EdgeFinishShape extends BaseShape {
  type: 'edgeFinish'
  x: number
  y: number
  width: number
  height: number
  edgeType: EdgeFinishType
  strokeWidth: number
  stroke: string
  fill: string
}

export interface TextShape extends BaseShape {
  type: 'text'
  x: number
  y: number
  text: string
  fontSize: number
  fill: string
}

export type ComponentOrientation =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export interface ComponentShape extends BaseShape {
  type: 'component'
  x: number
  y: number
  width: number
  height: number
  componentType: ComponentType
  rotation: number
  strokeWidth: number
  stroke: string
  fill: string
  params?: {
    thickness?: number
    orientation?: ComponentOrientation
  }
}

export interface MeasurementShape extends BaseShape {
  type: 'measurement'
  x1: number
  y1: number
  x2: number
  y2: number
  valueMm: number
  label: string
  sourceShapeId?: string
}

export type Shape =
  | LineShape
  | RectShape
  | CircleShape
  | EdgeFinishShape
  | TextShape
  | ComponentShape
  | MeasurementShape

export function isLineShape(s: Shape): s is LineShape {
  return s.type === 'line'
}

export function isRectShape(s: Shape): s is RectShape {
  return s.type === 'rect'
}

export function isCircleShape(s: Shape): s is CircleShape {
  return s.type === 'circle'
}

export function isEdgeFinishShape(s: Shape): s is EdgeFinishShape {
  return s.type === 'edgeFinish'
}

export function isTextShape(s: Shape): s is TextShape {
  return s.type === 'text'
}

export function isComponentShape(s: Shape): s is ComponentShape {
  return s.type === 'component'
}

export function isMeasurementShape(s: Shape): s is MeasurementShape {
  return s.type === 'measurement'
}
