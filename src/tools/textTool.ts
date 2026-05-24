import { useCanvasStore } from '../store/canvasStore'
import { useProjectStore } from '../store/projectStore'
import { snapPoint } from '../utils/grid'
import { createTextShape } from '../utils/shapes'
import type { ToolHandler } from './types'

function snapWorld(x: number, y: number) {
  const { snapEnabled } = useCanvasStore.getState()
  return snapEnabled ? snapPoint(x, y) : { x, y }
}

export const textTool: ToolHandler = {
  onPointerDown(ctx) {
    const p = snapWorld(ctx.world.x, ctx.world.y)
    const value = window.prompt('Digite o texto:')
    if (!value) return

    useProjectStore.getState().addShape(createTextShape(p.x, p.y, value))
  },

  onCancel() {
    useCanvasStore.getState().setDraft(null)
  },
}
