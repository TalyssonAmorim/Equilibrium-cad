import { memo, useMemo } from 'react'
import { Layer, Line } from 'react-konva'
import { useCanvasStore } from '../../store/canvasStore'
import { getVisibleWorldBounds } from '../../utils/camera'
import {
  GRID_MAJOR_COLOR,
  GRID_MINOR_COLOR,
  GRID_MAJOR_CM,
  GRID_MINOR_CM,
} from '../../utils/constants'
import { getGridLineRange, isMajorGridLine } from '../../utils/grid'
import { WorldGroup } from '../WorldGroup'

function GridLayerInner() {
  const camera = useCanvasStore((s) => s.camera)
  const viewport = useCanvasStore((s) => s.viewport)

  const lines = useMemo(() => {
    const bounds = getVisibleWorldBounds(camera, viewport)
    const padding = GRID_MAJOR_CM * 2
    const minX = bounds.minX - padding
    const maxX = bounds.maxX + padding
    const minY = bounds.minY - padding
    const maxY = bounds.maxY + padding

    const verticals = getGridLineRange(minX, maxX, GRID_MINOR_CM)
    const horizontals = getGridLineRange(minY, maxY, GRID_MINOR_CM)

    const result: {
      key: string
      points: number[]
      stroke: string
      strokeWidth: number
    }[] = []

    for (const x of verticals) {
      result.push({
        key: `v-${x}`,
        points: [x, minY, x, maxY],
        stroke: isMajorGridLine(x) ? GRID_MAJOR_COLOR : GRID_MINOR_COLOR,
        strokeWidth: isMajorGridLine(x) ? 0.4 : 0.2,
      })
    }
    for (const y of horizontals) {
      result.push({
        key: `h-${y}`,
        points: [minX, y, maxX, y],
        stroke: isMajorGridLine(y) ? GRID_MAJOR_COLOR : GRID_MINOR_COLOR,
        strokeWidth: isMajorGridLine(y) ? 0.4 : 0.2,
      })
    }
    return result
  }, [camera, viewport])

  return (
    <Layer listening={false} perfectDrawEnabled={false}>
      <WorldGroup>
        {lines.map((line) => (
          <Line
            key={line.key}
            points={line.points}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth / camera.scale}
            listening={false}
            perfectDrawEnabled={false}
          />
        ))}
      </WorldGroup>
    </Layer>
  )
}

export const GridLayer = memo(GridLayerInner)
