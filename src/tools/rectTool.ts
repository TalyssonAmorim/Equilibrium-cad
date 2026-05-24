import { useCanvasStore } from '../store/canvasStore'
import { useProjectStore } from '../store/projectStore'
import { snapPoint } from '../utils/grid'
import { createRectShape } from '../utils/shapes'
import type { ToolHandler } from './types'

function snapWorld(x: number, y: number) {
  const { snapEnabled } = useCanvasStore.getState()
  return snapEnabled ? snapPoint(x, y) : { x, y }
}

export const rectTool: ToolHandler = {
  onPointerDown(ctx) {
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      kind: 'rect',
      startX: p.x,
      startY: p.y,
      currentX: p.x,
      currentY: p.y,
    })
  },
  onPointerMove(ctx) {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'rect') return
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      ...draft,
      currentX: p.x,
      currentY: p.y,
    })
  },
  onPointerUp(ctx) {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'rect') return
    const end = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft(null)
    const x = Math.min(draft.startX, end.x)
    const y = Math.min(draft.startY, end.y)
    const width = Math.abs(end.x - draft.startX)
    const height = Math.abs(end.y - draft.startY)
    if (width < 1 || height < 1) return
    useProjectStore.getState().addShape(createRectShape(x, y, width, height))
  },
  onCancel() {
    useCanvasStore.getState().setDraft(null)
  },
}
