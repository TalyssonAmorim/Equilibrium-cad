import { Line, Text, Group } from 'react-konva'
import type { RectShape, LineShape, ComponentShape, EdgeFinishShape } from '../types/shapes'
import { getSidesColors, SIDE_COLORS, type SideLabel } from '../utils/sides'
import { DEFAULT_TEXT_FONT_SIZE, DEFAULT_FONT_FAMILY } from '../utils/constants'

interface RenderLabelProps {
  selected?: boolean
}

const SIDE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F']

export function renderRectLabels(shape: RectShape, props?: RenderLabelProps) {
  void props
  const sidesColors = getSidesColors(shape)
  const padding = 8
  const lineWidth = 4

  // Top side (A)
  const topY = shape.y - padding - lineWidth / 2
  const topColor = SIDE_COLORS[sidesColors['A'] || 'null']

  // Right side (B)
  const rightX = shape.x + shape.width + padding + lineWidth / 2
  const rightColor = SIDE_COLORS[sidesColors['B'] || 'null']

  // Bottom side (C)
  const bottomY = shape.y + shape.height + padding + lineWidth / 2
  const bottomColor = SIDE_COLORS[sidesColors['C'] || 'null']

  // Left side (D)
  const leftX = shape.x - padding - lineWidth / 2
  const leftColor = SIDE_COLORS[sidesColors['D'] || 'null']

  return (
    <Group>
      {/* Top side - A */}
      {topColor !== 'transparent' && (
        <>
          <Line
            points={[shape.x, topY, shape.x + shape.width, topY]}
            stroke={topColor}
            strokeWidth={lineWidth}
            listening={false}
          />
          <Text
            x={shape.x + shape.width / 2 - 6}
            y={topY - 18}
            text="A"
            fontSize={DEFAULT_TEXT_FONT_SIZE + 2}
            fontStyle="bold"
            fill={topColor}
            fontFamily={DEFAULT_FONT_FAMILY}
            listening={false}
          />
        </>
      )}

      {/* Right side - B */}
      {rightColor !== 'transparent' && (
        <>
          <Line
            points={[rightX, shape.y, rightX, shape.y + shape.height]}
            stroke={rightColor}
            strokeWidth={lineWidth}
            listening={false}
          />
          <Text
            x={rightX + 8}
            y={shape.y + shape.height / 2 - 8}
            text="B"
            fontSize={DEFAULT_TEXT_FONT_SIZE + 2}
            fontStyle="bold"
            fill={rightColor}
            fontFamily={DEFAULT_FONT_FAMILY}
            listening={false}
          />
        </>
      )}

      {/* Bottom side - C */}
      {bottomColor !== 'transparent' && (
        <>
          <Line
            points={[shape.x, bottomY, shape.x + shape.width, bottomY]}
            stroke={bottomColor}
            strokeWidth={lineWidth}
            listening={false}
          />
          <Text
            x={shape.x + shape.width / 2 - 6}
            y={bottomY + 8}
            text="C"
            fontSize={DEFAULT_TEXT_FONT_SIZE + 2}
            fontStyle="bold"
            fill={bottomColor}
            fontFamily={DEFAULT_FONT_FAMILY}
            listening={false}
          />
        </>
      )}

      {/* Left side - D */}
      {leftColor !== 'transparent' && (
        <>
          <Line
            points={[leftX, shape.y, leftX, shape.y + shape.height]}
            stroke={leftColor}
            strokeWidth={lineWidth}
            listening={false}
          />
          <Text
            x={leftX - 18}
            y={shape.y + shape.height / 2 - 8}
            text="D"
            fontSize={DEFAULT_TEXT_FONT_SIZE + 2}
            fontStyle="bold"
            fill={leftColor}
            fontFamily={DEFAULT_FONT_FAMILY}
            listening={false}
          />
        </>
      )}
    </Group>
  )
}

export function renderLineLabels(shape: LineShape, props?: RenderLabelProps) {
  void props
  const sidesColors = getSidesColors(shape)
  const points = shape.points ?? [shape.x1, shape.y1, shape.x2, shape.y2]
  
  if (points.length < 4) return null

  const numSides = Math.max(3, points.length / 2)
  const padding = 8
  const lineWidth = 4

  return (
    <Group>
      {Array.from({ length: numSides }).map((_, i) => {
        const label = SIDE_LABELS[i] as SideLabel
        const color = sidesColors[label] || null
        const hexColor = SIDE_COLORS[color ?? 'null']

        if (hexColor === 'transparent') return null

        // Conectar vértice i ao vértice i+1
        const x1 = points[i * 2]
        const y1 = points[i * 2 + 1]
        const x2 = points[((i + 1) % numSides) * 2]
        const y2 = points[((i + 1) % numSides) * 2 + 1]

        // Ponto médio e perpendicular
        const midX = (x1 + x2) / 2
        const midY = (y1 + y2) / 2
        const dx = x2 - x1
        const dy = y2 - y1
        const len = Math.hypot(dx, dy) || 1
        const normX = dy / len
        const normY = -dx / len

        const labelX = midX + normX * (padding + lineWidth)
        const labelY = midY + normY * (padding + lineWidth)

        return (
          <Group key={`line-label-${i}`}>
            <Line
              points={[x1, y1, x2, y2]}
              stroke={hexColor}
              strokeWidth={lineWidth}
              listening={false}
            />
            <Text
              x={labelX - 6}
              y={labelY - 8}
              text={label}
              fontSize={DEFAULT_TEXT_FONT_SIZE + 2}
              fontStyle="bold"
              fill={hexColor}
              fontFamily={DEFAULT_FONT_FAMILY}
              listening={false}
            />
          </Group>
        )
      })}
    </Group>
  )
}

export function renderComponentLabels(shape: ComponentShape, props?: RenderLabelProps) {
  void props
  return renderRectLabels(
    {
      ...shape,
      type: 'rect',
    } as any,
  )
}

export function renderEdgeFinishLabels(shape: EdgeFinishShape, props?: RenderLabelProps) {
  void props
  return renderRectLabels(
    {
      ...shape,
      type: 'rect',
    } as any,
  )
}
