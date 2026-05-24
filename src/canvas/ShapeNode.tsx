import { memo } from 'react'
import { Line, Rect, Circle, Text, Group } from 'react-konva'
import type { Shape } from '../types/shapes'
import { SELECTION_COLOR } from '../utils/constants'
import { EdgeFinishNode } from './EdgeFinishNode'
import { ComponentNode } from './ComponentNode'

interface ShapeNodeProps {
  shape: Shape
  selected: boolean
}

function ShapeNodeInner({ shape, selected }: ShapeNodeProps) {
  const highlight = selected ? SELECTION_COLOR : undefined

  switch (shape.type) {
    case 'line':
      return (
        <Line
          points={shape.points ?? [shape.x1, shape.y1, shape.x2, shape.y2]}
          stroke={highlight ?? shape.stroke}
          strokeWidth={shape.strokeWidth}
          lineCap="round"
          lineJoin="round"
          perfectDrawEnabled={false}
          hitStrokeWidth={12}
        />
      )
    case 'rect':
      return (
        <Rect
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          stroke={highlight ?? shape.stroke}
          strokeWidth={shape.strokeWidth}
          fill={shape.fill}
          perfectDrawEnabled={false}
        />
      )
    case 'edgeFinish':
      return <EdgeFinishNode shape={shape} highlight={highlight} />
    case 'circle':
      return (
        <Circle
          x={shape.cx}
          y={shape.cy}
          radius={shape.radius}
          stroke={highlight ?? shape.stroke}
          strokeWidth={shape.strokeWidth}
          fill={shape.fill}
          perfectDrawEnabled={false}
        />
      )
    case 'component':
      return <ComponentNode shape={shape} selected={selected} />
    case 'text':
      return (
        <Text
          x={shape.x}
          y={shape.y}
          text={shape.text}
          fontSize={shape.fontSize}
          fill={highlight ?? shape.fill}
        />
      )
    case 'measurement':
      return (
        <Group listening={false}>
          <Line
            points={[shape.x1, shape.y1, shape.x2, shape.y2]}
            stroke="rgba(251, 191, 36, 0.5)"
            strokeWidth={0.25}
            dash={[4, 4]}
            listening={false}
          />
          <Text
            x={(shape.x1 + shape.x2) / 2}
            y={(shape.y1 + shape.y2) / 2 - 8}
            text={shape.label}
            fontSize={10}
            fill="#fbbf24"
            align="center"
            offsetX={20}
            listening={false}
          />
        </Group>
      )
    default:
      return null
  }
}

export const ShapeNode = memo(
  ShapeNodeInner,
  (prev, next) =>
    prev.selected === next.selected && prev.shape === next.shape,
)
