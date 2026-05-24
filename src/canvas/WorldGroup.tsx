import type { ReactNode } from 'react'
import { Group } from 'react-konva'
import { useCanvasStore } from '../store/canvasStore'

interface WorldGroupProps {
  children: ReactNode
}

/** Aplica transformação da câmera virtual (mundo mm → tela px) */
export function WorldGroup({ children }: WorldGroupProps) {
  const camera = useCanvasStore((s) => s.camera)
  const viewport = useCanvasStore((s) => s.viewport)

  const offsetX = viewport.width / 2 - camera.x * camera.scale
  const offsetY = viewport.height / 2 - camera.y * camera.scale

  return (
    <Group x={offsetX} y={offsetY} scaleX={camera.scale} scaleY={camera.scale}>
      {children}
    </Group>
  )
}
