import { useCanvasStore } from '../store/canvasStore'
import { useProjectStore } from '../store/projectStore'
import { snapPoint } from '../utils/grid'
import { createLineShape } from '../utils/shapes'
import type { ToolHandler } from './types'

function snapWorld(x: number, y: number) {
  const { snapEnabled } = useCanvasStore.getState()
  return snapEnabled ? snapPoint(x, y) : { x, y }
}

export const penTool: ToolHandler = {
  onPointerDown(ctx) {
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      kind: 'pen',
      points: [p.x, p.y],
    })
  },

  onPointerMove(ctx) {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'pen') return

    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      kind: 'pen',
      points: [...draft.points, p.x, p.y],
    })
  },

  onPointerUp() {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'pen') return

    useCanvasStore.getState().setDraft(null)

    const points = draft.points
    if (points.length < 4) return

    const x1 = points[0]
    const y1 = points[1]
    const x2 = points[points.length - 2]
    const y2 = points[points.length - 1]

    if (Math.hypot(x2 - x1, y2 - y1) < 2) return

    useProjectStore.getState().addShape(createLineShape(x1, y1, x2, y2, points))
  },

  onCancel() {
    useCanvasStore.getState().setDraft(null)
  },
}
