import { Line, Text, Group } from 'react-konva'
import type { RectShape } from '../types/shapes'
import { getSideLabels, getSidesColors, SIDE_COLORS } from '../utils/sides'
import { DEFAULT_TEXT_FONT_SIZE, DEFAULT_FONT_FAMILY } from '../utils/constants'

interface SideLabelsRendererProps {
  shape: RectShape
  selected: boolean
}

export function SideLabelsRenderer({ shape, selected }: SideLabelsRendererProps) {
  const sidesColors = getSidesColors(shape)
  const sideLabels = getSideLabels(4) // rect tem 4 lados

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
