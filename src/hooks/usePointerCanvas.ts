import { useCallback, useRef } from 'react'
import { useCanvasStore } from '../store/canvasStore'
import { getToolHandler } from '../tools'
import { screenToWorld } from '../utils/camera'
import type { ToolContext } from '../tools/types'

const DRAWING_TOOLS = new Set([
  'line',
  'rect',
  'circle',
  'shapes',
  'measure',
  'text',
  'pen',
  'roda-banca',
  'eraser',
  'component',
  'lshape',
])

interface PointerState {
  id: number
  x: number
  y: number
  type: string
}

export function usePointerCanvas() {
  const pointersRef = useRef<Map<number, PointerState>>(new Map())
  const pinchRef = useRef<{
    distance: number
    centerX: number
    centerY: number
  } | null>(null)
  const activeDrawPointer = useRef<number | null>(null)

  const buildContext = useCallback(
    (e: React.PointerEvent<HTMLDivElement>): ToolContext => {
      const viewport = useCanvasStore.getState().viewport
      const camera = useCanvasStore.getState().camera
      const rect = e.currentTarget.getBoundingClientRect()
      const screen = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      return {
        world: screenToWorld(screen, camera, viewport),
        screen,
        pointerId: e.pointerId,
        pointerType: e.pointerType,
        pressure: e.pressure,
      }
    },
    [],
  )

  const handleTwoFingerGesture = useCallback(() => {
    const pts = [...pointersRef.current.values()]
    if (pts.length !== 2) {
      pinchRef.current = null
      return true
    }

    const [a, b] = pts
    const dx = b.x - a.x
    const dy = b.y - a.y
    const distance = Math.hypot(dx, dy)
    const centerX = (a.x + b.x) / 2
    const centerY = (a.y + b.y) / 2

    if (pinchRef.current) {
      const factor = distance / pinchRef.current.distance
      if (Math.abs(factor - 1) > 0.002) {
        useCanvasStore
          .getState()
          .zoomAtScreen(centerX, centerY, factor)
      }
      const panDx = centerX - pinchRef.current.centerX
      const panDy = centerY - pinchRef.current.centerY
      if (panDx !== 0 || panDy !== 0) {
        useCanvasStore.getState().panByScreen(panDx, panDy)
      }
    }

    pinchRef.current = { distance, centerX, centerY }
    return true
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      const rect = e.currentTarget.getBoundingClientRect()
      pointersRef.current.set(e.pointerId, {
        id: e.pointerId,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        type: e.pointerType,
      })

      if (pointersRef.current.size >= 2) {
        activeDrawPointer.current = null
        useCanvasStore.getState().setDraft(null)
        handleTwoFingerGesture()
        return
      }

      const { activeTool } = useCanvasStore.getState()
      const isPen = e.pointerType === 'pen'

      if (activeTool === 'pan') {
        useCanvasStore.getState().setIsPanning(true)
        getToolHandler('pan').onPointerDown?.(buildContext(e))
        return
      }

      const canDraw =
        DRAWING_TOOLS.has(activeTool) &&
        (isPen || e.pointerType === 'mouse' || e.pointerType === 'touch')

      if (canDraw) {
        activeDrawPointer.current = e.pointerId
        getToolHandler(activeTool).onPointerDown?.(buildContext(e))
        return
      }

      if (activeTool === 'select') {
        getToolHandler('select').onPointerDown?.(buildContext(e))
      }
    },
    [buildContext, handleTwoFingerGesture],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const entry = pointersRef.current.get(e.pointerId)
      if (entry) {
        entry.x = e.clientX - rect.left
        entry.y = e.clientY - rect.top
      }

      if (pointersRef.current.size >= 2) {
        handleTwoFingerGesture()
        return
      }

      const { activeTool, isPanning } = useCanvasStore.getState()

      if (isPanning) {
        getToolHandler('pan').onPointerMove?.(buildContext(e))
        return
      }

      if (activeDrawPointer.current === e.pointerId) {
        getToolHandler(activeTool).onPointerMove?.(buildContext(e))
        return
      }

      const handler = getToolHandler(activeTool)
      handler.onPointerMove?.(buildContext(e))
    },
    [buildContext, handleTwoFingerGesture],
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      pointersRef.current.delete(e.pointerId)
      pinchRef.current =
        pointersRef.current.size >= 2 ? pinchRef.current : null

      const ctx = buildContext(e)
      const { activeTool, isPanning } = useCanvasStore.getState()

      if (isPanning) {
        getToolHandler('pan').onPointerUp?.(ctx)
        useCanvasStore.getState().setIsPanning(false)
      }

      if (activeDrawPointer.current === e.pointerId) {
        getToolHandler(activeTool).onPointerUp?.(ctx)
        activeDrawPointer.current = null
      } else {
        getToolHandler(activeTool).onPointerUp?.(ctx)
      }

      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        /* already released */
      }
    },
    [buildContext],
  )

  const onPointerCancel = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      pointersRef.current.delete(e.pointerId)
      activeDrawPointer.current = null
      pinchRef.current = null
      useCanvasStore.getState().setIsPanning(false)
      useCanvasStore.getState().setDraft(null)
      getToolHandler(useCanvasStore.getState().activeTool).onCancel?.()
    },
    [],
  )

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel }
}
