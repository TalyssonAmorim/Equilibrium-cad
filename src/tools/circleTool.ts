import { useCanvasStore } from '../store/canvasStore'
import { useProjectStore } from '../store/projectStore'
import { snapPoint } from '../utils/grid'
import { createCircleShape } from '../utils/shapes'
import type { ToolHandler } from './types'

function snapWorld(x: number, y: number) {
  const { snapEnabled } = useCanvasStore.getState()
  return snapEnabled ? snapPoint(x, y) : { x, y }
}

export const circleTool: ToolHandler = {
  onPointerDown(ctx) {
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      kind: 'circle',
      centerX: p.x,
      centerY: p.y,
      currentX: p.x,
      currentY: p.y,
    })
  },
  onPointerMove(ctx) {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'circle') return
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      ...draft,
      currentX: p.x,
      currentY: p.y,
    })
  },
  onPointerUp(ctx) {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'circle') return
    const edge = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft(null)
    const radius = Math.hypot(
      edge.x - draft.centerX,
      edge.y - draft.centerY,
    )
    if (radius < 5) return
    useProjectStore
      .getState()
      .addShape(createCircleShape(draft.centerX, draft.centerY, radius))
  },
  onCancel() {
    useCanvasStore.getState().setDraft(null)
  },
}
