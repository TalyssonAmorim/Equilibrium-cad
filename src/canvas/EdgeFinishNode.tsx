import { Group, Path, Text, Rect } from 'react-konva'
import { DEFAULT_TEXT_FONT_SIZE, DEFAULT_TEXT_COLOR, DEFAULT_FONT_FAMILY } from '../utils/constants'
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
        strokeWidth={(shape.strokeWidth / Math.min(scaleX, scaleY)) * 0.5}
        lineJoin="round"
        perfectDrawEnabled={false}
      />
      <Text
        x={0}
        y={shape.height + 4}
        width={shape.width}
        text={def.shortLabel}
        fontSize={DEFAULT_TEXT_FONT_SIZE}
        fill={highlight ?? DEFAULT_TEXT_COLOR}
        fontFamily={DEFAULT_FONT_FAMILY}
        align="center"
        listening={false}
      />
      {(() => {
        const range = Math.max(0, Math.min(1, shape.range ?? 0))
        const cm = Math.round(1 + range * 49)

        return (
          <Text
            x={0}
            y={shape.height + 4 + DEFAULT_TEXT_FONT_SIZE + 6}
            width={shape.width}
            text={`${cm} cm`}
            fontSize={DEFAULT_TEXT_FONT_SIZE}
            fill={highlight ?? DEFAULT_TEXT_COLOR}
            fontFamily={DEFAULT_FONT_FAMILY}
            align="center"
            listening={false}
          />
        )
      })()}
    </Group>
  )
}
