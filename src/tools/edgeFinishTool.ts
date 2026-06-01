import { useCanvasStore } from '../store/canvasStore'
import { useProjectStore } from '../store/projectStore'
import {
  DEFAULT_EDGE_FINISH_HEIGHT_CM,
  DEFAULT_EDGE_FINISH_WIDTH_CM,
} from '../utils/constants'
import { snapPoint } from '../utils/grid'
import { createEdgeFinishShape } from '../utils/shapes'
import type { ToolHandler } from './types'

function snapWorld(x: number, y: number) {
  const { snapEnabled } = useCanvasStore.getState()
  return snapEnabled ? snapPoint(x, y) : { x, y }
}

export const edgeFinishTool: ToolHandler = {
  onPointerDown(ctx) {
    const edgeType = useCanvasStore.getState().selectedEdgeFinish
    if (!edgeType) return
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      kind: 'edgeFinish',
      edgeType,
      startX: p.x,
      startY: p.y,
      currentX: p.x,
      currentY: p.y,
    })
  },
  onPointerMove(ctx) {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'edgeFinish') return
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      ...draft,
      currentX: p.x,
      currentY: p.y,
    })
  },
  onPointerUp(ctx) {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'edgeFinish') return
    const end = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft(null)

    let x = Math.min(draft.startX, end.x)
    let y = Math.min(draft.startY, end.y)
    let width = Math.abs(end.x - draft.startX)
    let height = Math.abs(end.y - draft.startY)

    if (width < 0.8 && height < 0.8) {
      width = DEFAULT_EDGE_FINISH_WIDTH_CM
      height = DEFAULT_EDGE_FINISH_HEIGHT_CM
      x = draft.startX - width / 2
      y = draft.startY - height / 2
    }

    if (width < 0.5 || height < 0.5) return

    const range = useCanvasStore.getState().selectedEdgeFinishRange
    useProjectStore
      .getState()
      .addShape(
        createEdgeFinishShape(x, y, width, height, draft.edgeType, range),
      )
    useCanvasStore.getState().setActiveTool('select')
  },
  onCancel() {
    useCanvasStore.getState().setDraft(null)
  },
}
