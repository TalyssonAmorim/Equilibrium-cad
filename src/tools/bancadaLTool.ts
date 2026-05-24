import { useProjectStore } from '../store/projectStore'
import { useCanvasStore } from '../store/canvasStore'
import { createComponentShape } from '../utils/shapes'
import { snapPoint } from '../utils/grid'
import type { ToolHandler } from './types'
import type { ComponentOrientation } from '../types/shapes'

const MIN_DIMENSION = 60

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

export const bancadaLTool: ToolHandler = {
  onPointerDown(ctx) {
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      kind: 'component',
      componentType: 'bancada_l',
      startX: p.x,
      startY: p.y,
      currentX: p.x,
      currentY: p.y,
    })
  },

  onPointerMove(ctx) {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'component') return
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      ...draft,
      currentX: p.x,
      currentY: p.y,
    })
  },

  onPointerUp() {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'component') return

    useCanvasStore.getState().setDraft(null)

    const width = Math.abs(draft.currentX - draft.startX)
    const height = Math.abs(draft.currentY - draft.startY)
    if (width < MIN_DIMENSION || height < MIN_DIMENSION) return

    const orientation = findOrientation(
      draft.startX,
      draft.startY,
      draft.currentX,
      draft.currentY,
    )
    const x = Math.min(draft.startX, draft.currentX)
    const y = Math.min(draft.startY, draft.currentY)

    const shape = createComponentShape(x, y, width, height, 'bancada_l', {
      orientation,
      thickness: Math.min(width, height) * 0.25,
    })

    useProjectStore.getState().addShape(shape)
  },

  onCancel() {
    useCanvasStore.getState().setDraft(null)
  },
}
