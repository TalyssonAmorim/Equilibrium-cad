import { useEffect, useRef } from 'react'
import { Stage } from 'react-konva'
import { useCanvasStore } from '../store/canvasStore'
import { CANVAS_BACKGROUND } from '../utils/constants'
import { usePointerCanvas } from '../hooks/usePointerCanvas'
import { GridLayer } from './layers/GridLayer'
import { DrawingLayer } from './layers/DrawingLayer'
import { MeasurementLayer } from './layers/MeasurementLayer'
import { UILayer } from './layers/UILayer'
import { screenToWorld } from '../utils/camera'
import { useProjectStore } from '../store/projectStore'
import type { ComponentType } from '../types/components'
import { getComponentInitialSize } from '../utils/shapes'
import { createComponentShape } from '../utils/shapes'

interface InfiniteCanvasProps {
  width: number
  height: number
}

export function InfiniteCanvas({ width, height }: InfiniteCanvasProps) {
  const setStageRef = useCanvasStore((s) => s.setStageRef)
  const stageRef = useRef<import('konva').default.Stage>(null)
  const pointerHandlers = usePointerCanvas()

  useEffect(() => {
    if (stageRef.current) {
      setStageRef(stageRef.current)
    }
    return () => setStageRef(null)
  }, [setStageRef, width, height])

  if (width <= 0 || height <= 0) return null

  return (
    <div
      className="absolute inset-0 touch-none"
      style={{ width, height }}
      {...pointerHandlers}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      }}
      onDrop={(e) => {
        e.preventDefault()
        const compId = e.dataTransfer.getData('application/component')
        if (!compId) return

        const componentType = compId as ComponentType
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
        const screen = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        const camera = useCanvasStore.getState().camera
        const viewport = useCanvasStore.getState().viewport
        const world = screenToWorld(screen, camera, viewport)
        const { width, height } = getComponentInitialSize(componentType)
        const shape = createComponentShape(
          world.x - width / 2,
          world.y - height / 2,
          width,
          height,
          componentType,
        )
        useProjectStore.getState().addShape(shape)
      }}
    >
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        style={{ background: CANVAS_BACKGROUND }}
        listening={false}
      >
        <GridLayer />
        <DrawingLayer />
        <MeasurementLayer />
        <UILayer />
      </Stage>
    </div>
  )
}
