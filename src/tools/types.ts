import type { WorldPoint } from '../types/camera'

export interface ToolContext {
  world: WorldPoint
  screen: { x: number; y: number }
  pointerId: number
  pointerType: string
  pressure: number
}

export interface ToolHandler {
  onPointerDown?: (ctx: ToolContext) => void
  onPointerMove?: (ctx: ToolContext) => void
  onPointerUp?: (ctx: ToolContext) => void
  onCancel?: () => void
}
