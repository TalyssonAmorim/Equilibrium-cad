import { memo } from 'react'
import { Line, Rect, Circle, Text, Group } from 'react-konva'
import type {
  ComponentOrientation,
  LineShape,
  RectShape,
  Shape,
} from '../types/shapes'
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

  const hasTop = shape.orientation.startsWith('top')
  const hasLeft = shape.orientation.endsWith('left')

  const outerWidthX = shape.x + shape.width1 / 2
  const outerWidthY = hasTop ? shape.y - 14 : shape.y + shape.height1 + 8

  const innerWidthX = hasLeft
    ? shape.x + shape.width2 / 2
    : shape.x + shape.width1 - shape.width2 / 2
  const innerWidthY = hasTop
    ? shape.y + shape.height2 - 14
    : shape.y + shape.height1 - shape.height2 + 8

  const outerHeightX = hasLeft ? shape.x - 90 : shape.x + shape.width1 + 10
  const outerHeightY = shape.y + shape.height1 / 2
  const outerHeightAlign = hasLeft ? 'right' : 'left'

  const innerHeightY = hasTop
    ? shape.y + shape.height2 / 2
    : shape.y + shape.height1 - shape.height2 / 2

  const innerHeightAlign =
    shape.orientation === 'top-left' || shape.orientation === 'bottom-right'
      ? 'left'
      : 'right'

  const innerHeightXCoordinate =
    shape.orientation === 'top-left'
      ? shape.x + shape.width1
      : shape.orientation === 'top-right' || shape.orientation === 'bottom-right'
      ? shape.x + shape.width1 - shape.width2
      : shape.x + shape.width2

  const innerHeightX =
    innerHeightAlign === 'left'
      ? innerHeightXCoordinate + 10
      : innerHeightXCoordinate - 90

  return (
    <>
      <Text
        x={outerWidthX - 45}
        y={outerWidthY}
        width={90}
        text={width1Text}
        fontSize={10}
        fill="#94a3b8"
        align="center"
        listening={false}
      />
      <Text
        x={innerWidthX - 45}
        y={innerWidthY}
        width={90}
        text={width2Text}
        fontSize={10}
        fill="#94a3b8"
        align="center"
        listening={false}
      />
      <Text
        x={outerHeightX}
        y={outerHeightY}
        width={90}
        text={height1Text}
        fontSize={10}
        fill="#94a3b8"
        align={outerHeightAlign}
        listening={false}
      />
      <Text
        x={innerHeightX}
        y={innerHeightY}
        width={90}
        text={height2Text}
        fontSize={10}
        fill="#94a3b8"
        align={innerHeightAlign}
        listening={false}
      />
    </>
  )
}

function getRectMeasurementLabels(shape: RectShape) {
  const widthText = formatCm(shape.width)
  const heightText = formatCm(shape.height)
  const midX = shape.x + shape.width / 2
  const midY = shape.y + shape.height / 2

  return (
    <>
      <Text
        x={midX - 50}
        y={shape.y - 18}
        width={100}
        text={widthText}
        fontSize={10}
        fill="#94a3b8"
        align="center"
        listening={false}
      />
      <Text
        x={shape.x + shape.width + 14}
        y={midY - 6}
        width={60}
        text={heightText}
        fontSize={10}
        fill="#94a3b8"
        align="left"
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
        <Group>
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
          {getRectMeasurementLabels(shape)}
        </Group>
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
    case 'measurement': {
      const dx = shape.x2 - shape.x1
      const dy = shape.y2 - shape.y1
      const len = Math.hypot(dx, dy) || 1
      const normalX = -dy / len
      const normalY = dx / len
      const labelOffset = 16
      const labelX = (shape.x1 + shape.x2) / 2 - normalX * labelOffset
      const labelY = (shape.y1 + shape.y2) / 2 - normalY * labelOffset

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
            x={labelX}
            y={labelY}
            width={80}
            offsetX={40}
            offsetY={6}
            text={shape.label}
            fontSize={10}
            fill="#fbbf24"
            align="center"
            listening={false}
          />
        </Group>
      )
    }
    default:
      return null
  }
}

export const ShapeNode = memo(
  ShapeNodeInner,
  (prev, next) =>
    prev.selected === next.selected && prev.shape === next.shape,
)
