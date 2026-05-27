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

const HANDLE_HIT_CM = 1.4

let resizeSession: {
  shapeId: string
  handle: ResizeHandle
  initialShape: Shape
} | null = null

let moveSession: {
  shapeId: string
  initialShape: Shape
  startX: number
  startY: number
} | null = null

function snapWorld(x: number, y: number) {
  const { snapEnabled } = useCanvasStore.getState()
  return snapEnabled ? snapPoint(x, y) : { x, y }
}

function canMove(shape: Shape): boolean {
  return (
    shape.type === 'text' ||
    shape.type === 'rect' ||
    shape.type === 'edgeFinish' ||
    shape.type === 'component'
  )
}

function hitTestShape(
  worldX: number,
  worldY: number,
  toleranceCm: number,
): string | null {
  const shapes = useProjectStore.getState().project?.shapes ?? EMPTY_SHAPES
  const drawing = shapes.filter((s) => s.layer === 'drawing')
  for (let i = drawing.length - 1; i >= 0; i--) {
    const shape = drawing[i]
    if (shape.type === 'circle') {
      const d = Math.hypot(worldX - shape.cx, worldY - shape.cy)
      if (d <= shape.radius + toleranceCm) return shape.id
      continue
    }
    const bounds = getShapeBounds(shape)
    if (!bounds) continue
    if (
      worldX >= bounds.minX - toleranceCm &&
      worldX <= bounds.maxX + toleranceCm &&
      worldY >= bounds.minY - toleranceCm &&
      worldY <= bounds.maxY + toleranceCm
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
        HANDLE_HIT_CM,
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
    moveSession = null

    // Se clicou em uma forma já selecionada, inicia movimento
    if (selected && canMove(selected)) {
      const bounds = getShapeBounds(selected)
      if (bounds && ctx.world.x >= bounds.minX && ctx.world.x <= bounds.maxX &&
          ctx.world.y >= bounds.minY && ctx.world.y <= bounds.maxY) {
        useProjectStore.getState().captureUndoSnapshot()
        moveSession = {
          shapeId: selected.id,
          initialShape: structuredClone(selected),
          startX: ctx.world.x,
          startY: ctx.world.y,
        }
        return
      }
    }

    const hit = hitTestShape(ctx.world.x, ctx.world.y, 0.8)
    if (hit) {
      useCanvasStore.getState().setSelectedIds([hit])
    } else {
      useCanvasStore.getState().clearSelection()
    }
  },

  onPointerMove(ctx) {
    if (resizeSession) {
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
    } else if (moveSession) {
      const initialShape = moveSession.initialShape as any
      const dx = ctx.world.x - moveSession.startX
      const dy = ctx.world.y - moveSession.startY
      const p = snapWorld(initialShape.x + dx, initialShape.y + dy)
      
      const patch: Partial<Shape> = {
        x: p.x,
        y: p.y,
      }
      useProjectStore.getState().updateShape(moveSession.shapeId, patch, {
        recordUndo: false,
      })
    }
  },

  onPointerUp() {
    resizeSession = null
    moveSession = null
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
    if (moveSession) {
      useProjectStore
        .getState()
        .updateShape(
          moveSession.shapeId,
          moveSession.initialShape as Partial<Shape>,
          { recordUndo: false },
        )
    }
    resizeSession = null
    moveSession = null
  },
}
