import { useCanvasStore } from '../store/canvasStore'
import { useProjectStore } from '../store/projectStore'
import { EMPTY_SHAPES } from '../store/selectors'
import { snapPoint } from '../utils/grid'
import { getShapeBounds } from '../utils/shapes'
import {
  applyResize,
  hitTestResizeHandle,
  type ResizeHandle,
} from '../utils/transform'
import type { ToolHandler } from './types'
import type { Shape } from '../types/shapes'

const HANDLE_HIT_MM = 14

let resizeSession: {
  shapeId: string
  handle: ResizeHandle
  initialShape: Shape
} | null = null

function snapWorld(x: number, y: number) {
  const { snapEnabled } = useCanvasStore.getState()
  return snapEnabled ? snapPoint(x, y) : { x, y }
}

function hitTestShape(
  worldX: number,
  worldY: number,
  toleranceMm: number,
): string | null {
  const shapes = useProjectStore.getState().project?.shapes ?? EMPTY_SHAPES
  const drawing = shapes.filter((s) => s.layer === 'drawing')
  for (let i = drawing.length - 1; i >= 0; i--) {
    const shape = drawing[i]
    if (shape.type === 'circle') {
      const d = Math.hypot(worldX - shape.cx, worldY - shape.cy)
      if (d <= shape.radius + toleranceMm) return shape.id
      continue
    }
    const bounds = getShapeBounds(shape)
    if (!bounds) continue
    if (
      worldX >= bounds.minX - toleranceMm &&
      worldX <= bounds.maxX + toleranceMm &&
      worldY >= bounds.minY - toleranceMm &&
      worldY <= bounds.maxY + toleranceMm
    ) {
      return shape.id
    }
  }
  return null
}

function getSelectedShape(): Shape | null {
  const { selectedIds } = useCanvasStore.getState()
  if (selectedIds.length !== 1) return null
  const shapes = useProjectStore.getState().project?.shapes ?? EMPTY_SHAPES
  return shapes.find((s) => s.id === selectedIds[0]) ?? null
}

export const selectTool: ToolHandler = {
  onPointerDown(ctx) {
    const selected = getSelectedShape()
    if (selected) {
      const handle = hitTestResizeHandle(
        ctx.world.x,
        ctx.world.y,
        selected,
        HANDLE_HIT_MM,
      )
      if (handle) {
        useProjectStore.getState().captureUndoSnapshot()
        resizeSession = {
          shapeId: selected.id,
          handle,
          initialShape: structuredClone(selected),
        }
        return
      }
    }

    resizeSession = null
    const hit = hitTestShape(ctx.world.x, ctx.world.y, 8)
    if (hit) {
      useCanvasStore.getState().setSelectedIds([hit])
    } else {
      useCanvasStore.getState().clearSelection()
    }
  },

  onPointerMove(ctx) {
    if (!resizeSession) return
    const p = snapWorld(ctx.world.x, ctx.world.y)
    const patch = applyResize(
      resizeSession.initialShape,
      resizeSession.handle,
      p.x,
      p.y,
    )
    if (!patch) return
    useProjectStore.getState().updateShape(resizeSession.shapeId, patch, {
      recordUndo: false,
    })
  },

  onPointerUp() {
    resizeSession = null
  },

  onCancel() {
    if (resizeSession) {
      useProjectStore
        .getState()
        .updateShape(
          resizeSession.shapeId,
          resizeSession.initialShape as Partial<Shape>,
          { recordUndo: false },
        )
    }
    resizeSession = null
  },
}
