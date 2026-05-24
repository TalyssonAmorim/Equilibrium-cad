import { memo, useMemo } from 'react'
import { Layer } from 'react-konva'
import { useProjectStore } from '../../store/projectStore'
import { selectProjectShapes } from '../../store/selectors'
import { ShapeNode } from '../ShapeNode'
import { WorldGroup } from '../WorldGroup'

function MeasurementLayerInner() {
  const shapes = useProjectStore(selectProjectShapes)

  const measurements = useMemo(
    () => shapes.filter((s) => s.layer === 'measurement'),
    [shapes],
  )

  return (
    <Layer listening={false}>
      <WorldGroup>
        {measurements.map((shape) => (
          <ShapeNode key={shape.id} shape={shape} selected={false} />
        ))}
      </WorldGroup>
    </Layer>
  )
}

export const MeasurementLayer = memo(MeasurementLayerInner)
