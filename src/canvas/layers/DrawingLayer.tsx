import { memo, useMemo } from 'react'
import { Layer } from 'react-konva'
import { useProjectStore } from '../../store/projectStore'
import { selectProjectShapes } from '../../store/selectors'
import { useCanvasStore } from '../../store/canvasStore'
import { ShapeNode } from '../ShapeNode'
import { WorldGroup } from '../WorldGroup'

function DrawingLayerInner() {
  const shapes = useProjectStore(selectProjectShapes)
  const selectedIds = useCanvasStore((s) => s.selectedIds)
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])

  const drawingShapes = useMemo(
    () => shapes.filter((s) => s.layer === 'drawing'),
    [shapes],
  )

  return (
    <Layer>
      <WorldGroup>
        {drawingShapes.map((shape) => (
          <ShapeNode
            key={shape.id}
            shape={shape}
            selected={selectedSet.has(shape.id)}
          />
        ))}
      </WorldGroup>
    </Layer>
  )
}

export const DrawingLayer = memo(DrawingLayerInner)
