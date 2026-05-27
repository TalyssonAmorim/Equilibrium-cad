import { useProjectStore } from '../store/projectStore'
import { snapPoint } from '../utils/grid'
import { useCanvasStore } from '../store/canvasStore'
import { getShapeBounds } from '../utils/shapes'
import type { ToolHandler } from './types'

function snapWorld(x: number, y: number) {
  const { snapEnabled } = useCanvasStore.getState()
  return snapEnabled ? snapPoint(x, y) : { x, y }
}

export const eraserTool: ToolHandler = {
  onPointerDown(ctx) {
    const { project } = useProjectStore.getState()
    if (!project) return
    const p = snapWorld(ctx.world.x, ctx.world.y)
    const shape = project.shapes
      .filter((s) => s.layer === 'drawing')
      .find((shape) => {
        const bounds = getShapeBounds(shape)
        if (!bounds) return false
        return (
          p.x >= bounds.minX &&
          p.x <= bounds.maxX &&
          p.y >= bounds.minY &&
          p.y <= bounds.maxY
        )
      })
    if (!shape) return
    useProjectStore.getState().removeShapes([shape.id])
  },
}
