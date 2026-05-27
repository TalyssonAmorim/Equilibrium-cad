import { useProjectStore } from '../store/projectStore'
import { useCanvasStore } from '../store/canvasStore'
import { snapPoint } from '../utils/grid'
import { createLShape } from '../utils/shapes'
import type { ToolHandler } from './types'
import type { ComponentOrientation } from '../types/shapes'

const MIN_DIMENSION = 40

function snapWorld(x: number, y: number) {
  const { snapEnabled } = useCanvasStore.getState()
  return snapEnabled ? snapPoint(x, y) : { x, y }
}

function findOrientation(startX: number, startY: number, currentX: number, currentY: number): ComponentOrientation {
  const dx = currentX - startX
  const dy = currentY - startY
  if (dx >= 0 && dy >= 0) return 'top-left'
  if (dx < 0 && dy >= 0) return 'top-right'
  if (dx >= 0 && dy < 0) return 'bottom-left'
  return 'bottom-right'
}

export const lShapeTool: ToolHandler = {
  onPointerDown(ctx) {
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      kind: 'lshape',
      startX: p.x,
      startY: p.y,
      currentX: p.x,
      currentY: p.y,
    })
  },

  onPointerMove(ctx) {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'lshape') return
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      ...draft,
      currentX: p.x,
      currentY: p.y,
    })
  },

  onPointerUp() {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'lshape') return

    useCanvasStore.getState().setDraft(null)

    const width1 = Math.abs(draft.currentX - draft.startX)
    const height1 = Math.abs(draft.currentY - draft.startY)
    if (width1 < MIN_DIMENSION || height1 < MIN_DIMENSION) return

    const orientation = findOrientation(
      draft.startX,
      draft.startY,
      draft.currentX,
      draft.currentY,
    )
    const x = Math.min(draft.startX, draft.currentX)
    const y = Math.min(draft.startY, draft.currentY)
    const defaultSide = Math.max(10, Math.min(Math.round(Math.min(width1, height1) * 0.35), Math.min(width1, height1) - 10))

    const shape = createLShape(
      x,
      y,
      width1,
      height1,
      defaultSide,
      defaultSide,
      orientation,
    )
    useProjectStore.getState().addShape(shape)
  },

  onCancel() {
    useCanvasStore.getState().setDraft(null)
  },
}
