import { memo } from 'react'
import { Line, Rect, Circle, Text, Group } from 'react-konva'
import type { ComponentOrientation, LineShape, Shape } from '../types/shapes'
import { SELECTION_COLOR } from '../utils/constants'
import { EdgeFinishNode } from './EdgeFinishNode'
import { ComponentNode } from './ComponentNode'
import { formatCm } from '../utils/geometry'
import { createLShapePoints } from '../utils/shapes'

interface ShapeNodeProps {
  shape: Shape
  selected: boolean
}

function isLShape(shape: Shape): shape is LineShape & {
  x: number
  y: number
  width1: number
  width2: number
  height1: number
  height2: number
  orientation: ComponentOrientation
  closed: true
} {
  return (
    shape.type === 'line' &&
    shape.closed === true &&
    typeof shape.x === 'number' &&
    typeof shape.y === 'number' &&
    typeof shape.width1 === 'number' &&
    typeof shape.width2 === 'number' &&
    typeof shape.height1 === 'number' &&
    typeof shape.height2 === 'number' &&
    typeof shape.orientation === 'string'
  )
}

function getLShapeMeasurementLabels(shape: Extract<Shape, { type: 'line' }>) {
  if (!isLShape(shape)) return null

  const width1Text = formatCm(shape.width1)
  const width2Text = formatCm(shape.width2)
  const height1Text = formatCm(shape.height1)
  const height2Text = formatCm(shape.height2)

  const outerWidthY = shape.orientation.startsWith('bottom')
    ? shape.y + shape.height1 + 4
    : shape.y - 14
  const outerWidthX = shape.x + shape.width1 / 2

  const innerWidthY = shape.orientation.startsWith('bottom')
    ? shape.y + shape.height1 - shape.height2 + 4
    : shape.y + shape.height2 - 14
  const innerWidthX = shape.orientation.endsWith('left')
    ? shape.x + shape.width2 / 2
    : shape.x + shape.width1 - shape.width2 / 2

  const outerHeightX = shape.orientation.endsWith('right')
    ? shape.x + shape.width1 + 4
    : shape.x - 4
  const outerHeightY = shape.y + shape.height1 / 2

  const innerHeightX = shape.orientation.endsWith('right')
    ? shape.x + shape.width1 - shape.width2 + 4
    : shape.x + shape.width2 - 4
  const innerHeightY = shape.orientation.startsWith('bottom')
    ? shape.y + shape.height1 - shape.height2 / 2
    : shape.y + shape.height2 / 2

  const outerHeightAlign = shape.orientation.endsWith('right') ? 'left' : 'right'
  const innerHeightAlign = shape.orientation.endsWith('right') ? 'left' : 'right'

  return (
    <>
      <Text
        x={outerWidthX}
        y={outerWidthY}
        text={width1Text}
        fontSize={10}
        fill="#94a3b8"
        align="center"
        listening={false}
      />
      <Text
        x={innerWidthX}
        y={innerWidthY}
        text={width2Text}
        fontSize={10}
        fill="#94a3b8"
        align="center"
        listening={false}
      />
      <Text
        x={outerHeightX}
        y={outerHeightY}
        text={height1Text}
        fontSize={10}
        fill="#94a3b8"
        align={outerHeightAlign}
        listening={false}
      />
      <Text
        x={innerHeightX}
        y={innerHeightY}
        text={height2Text}
        fontSize={10}
        fill="#94a3b8"
        align={innerHeightAlign}
        listening={false}
      />
    </>
  )
}

function ShapeNodeInner({ shape, selected }: ShapeNodeProps) {
  const highlight = selected ? SELECTION_COLOR : undefined

  switch (shape.type) {
    case 'line': {
      const isLShapeLine = isLShape(shape)
      const points = isLShapeLine
        ? createLShapePoints(
            shape.x,
            shape.y,
            shape.width1,
            shape.height1,
            shape.width2,
            shape.height2,
            shape.orientation,
          )
        : shape.points ?? [shape.x1, shape.y1, shape.x2, shape.y2]

      return (
        <Group>
          <Line
            points={points}
            closed={shape.closed}
            stroke={highlight ?? shape.stroke}
            strokeWidth={shape.strokeWidth}
            lineCap="round"
            lineJoin="round"
            perfectDrawEnabled={false}
            hitStrokeWidth={12}
          />
          {isLShapeLine && getLShapeMeasurementLabels(shape)}
        </Group>
      )
    }
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
