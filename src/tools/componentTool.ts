import { useCanvasStore } from '../store/canvasStore'
import { useProjectStore } from '../store/projectStore'
import { getComponentDefinition } from '../types/components'
import { snapPoint } from '../utils/grid'
import { createComponentShape, getComponentInitialSize } from '../utils/shapes'
import type { ToolHandler } from './types'

const MIN_COMPONENT_SIZE = 40

function snapWorld(x: number, y: number) {
  const { snapEnabled } = useCanvasStore.getState()
  return snapEnabled ? snapPoint(x, y) : { x, y }
}

export const componentTool: ToolHandler = {
  onPointerDown(ctx) {
    const selectedComponent = useCanvasStore.getState().selectedComponent
    if (!selectedComponent) return

    const definition = getComponentDefinition(selectedComponent)
    if (!definition) return

    const p = snapWorld(ctx.world.x, ctx.world.y)
    const { width, height } = getComponentInitialSize(selectedComponent)

    useCanvasStore.getState().setDraft({
      kind: 'component',
      componentType: selectedComponent,
      startX: p.x,
      startY: p.y,
      currentX: p.x + width,
      currentY: p.y + height,
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

    if (width < MIN_COMPONENT_SIZE || height < MIN_COMPONENT_SIZE) return

    const shape = createComponentShape(
      Math.min(draft.startX, draft.currentX),
      Math.min(draft.startY, draft.currentY),
      width,
      height,
      draft.componentType,
    )

    useProjectStore.getState().addShape(shape)
  },

  onCancel() {
    useCanvasStore.getState().setDraft(null)
  },
}
