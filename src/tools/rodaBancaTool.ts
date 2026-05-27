import { useCanvasStore } from '../store/canvasStore'
import { useProjectStore } from '../store/projectStore'
import { snapPoint } from '../utils/grid'
import { createRodaBancaShape } from '../utils/shapes'
import type { ToolHandler } from './types'

function snapWorld(x: number, y: number) {
  const { snapEnabled } = useCanvasStore.getState()
  return snapEnabled ? snapPoint(x, y) : { x, y }
}

export const rodaBancaTool: ToolHandler = {
  onPointerDown(ctx) {
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      kind: 'roda-banca',
      startX: p.x,
      startY: p.y,
      currentX: p.x,
      currentY: p.y,
    })
  },

  onPointerMove(ctx) {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'roda-banca') return
    const p = snapWorld(ctx.world.x, ctx.world.y)
    useCanvasStore.getState().setDraft({
      ...draft,
      currentX: p.x,
      currentY: p.y,
    })
  },

  onPointerUp(ctx) {
    const draft = useCanvasStore.getState().draft
    if (!draft || draft.kind !== 'roda-banca') return
    const end = snapWorld(ctx.world.x, ctx.world.y)
    const { rodaBancaHeightCm } = useCanvasStore.getState()
    useCanvasStore.getState().setDraft(null)

    const dx = end.x - draft.startX
    const dy = end.y - draft.startY
    const len = Math.hypot(dx, dy)
    if (len < 1) return

    const shape = createRodaBancaShape(
      draft.startX,
      draft.startY,
      end.x,
      end.y,
      rodaBancaHeightCm,
    )
    useProjectStore.getState().addShape(shape)
  },

  onCancel() {
    useCanvasStore.getState().setDraft(null)
  },
}
