import { useCanvasStore } from '../store/canvasStore'
import { useProjectStore } from '../store/projectStore'
import { snapPoint } from '../utils/grid'
import { createLineShape } from '../utils/shapes'
import type { ToolHandler } from './types'

function snapWorld(x: number, y: number) {
  const { snapEnabled } = useCanvasStore.getState()
  return snapEnabled ? snapPoint(x, y) : { x, y }
}

export const lineTool: ToolHandler = {
  onPointerDown(ctx) {
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      kind: 'line',
      startX: p.x,
      startY: p.y,
      currentX: p.x,
      currentY: p.y,
    })
  },
  onPointerMove(ctx) {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'line') return
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      ...draft,
      currentX: p.x,
      currentY: p.y,
    })
  },
  onPointerUp(ctx) {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'line') return
    const end = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft(null)
    const len = Math.hypot(end.x - draft.startX, end.y - draft.startY)
    if (len < 1) return
    const line = createLineShape(
      draft.startX,
      draft.startY,
      end.x,
      end.y,
    )
    useProjectStore.getState().addShape(line, true)
  },
  onCancel() {
    useCanvasStore.getState().setDraft(null)
  },
}
