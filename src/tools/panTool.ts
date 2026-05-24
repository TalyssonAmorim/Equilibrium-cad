import { useCanvasStore } from '../store/canvasStore'
import type { ToolHandler } from './types'

let lastX = 0
let lastY = 0

export const panTool: ToolHandler = {
  onPointerDown(ctx) {
    lastX = ctx.screen.x
    lastY = ctx.screen.y
    useCanvasStore.getState().setIsPanning(true)
  },
  onPointerMove(ctx) {
    const dx = ctx.screen.x - lastX
    const dy = ctx.screen.y - lastY
    lastX = ctx.screen.x
    lastY = ctx.screen.y
    useCanvasStore.getState().panByScreen(dx, dy)
  },
  onPointerUp() {
    useCanvasStore.getState().setIsPanning(false)
  },
  onCancel() {
    useCanvasStore.getState().setIsPanning(false)
  },
}
