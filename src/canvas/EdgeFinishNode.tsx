import { Group, Path, Text } from 'react-konva'
import type { EdgeFinishShape } from '../types/shapes'
import { getEdgeFinishDefinition } from '../types/edgeFinish'
import { EDGE_FINISH_VIEWBOX } from '../types/edgeFinish'

interface EdgeFinishNodeProps {
  shape: EdgeFinishShape
  highlight?: string
}

export function EdgeFinishNode({ shape, highlight }: EdgeFinishNodeProps) {
  const def = getEdgeFinishDefinition(shape.edgeType)
  const scaleX = shape.width / EDGE_FINISH_VIEWBOX.width
  const scaleY = shape.height / EDGE_FINISH_VIEWBOX.height

  return (
    <Group x={shape.x} y={shape.y}>
      <Path
        data={def.path}
        scaleX={scaleX}
        scaleY={scaleY}
        fill={shape.fill}
        stroke={highlight ?? shape.stroke}
        strokeWidth={shape.strokeWidth / Math.min(scaleX, scaleY)}
        lineJoin="round"
        perfectDrawEnabled={false}
      />
      <Text
        x={0}
        y={shape.height + 4}
        width={shape.width}
        text={def.shortLabel}
        fontSize={9}
        fill={highlight ?? '#64748b'}
        align="center"
        listening={false}
      />
    </Group>
  )
}
