import { Circle, Group, Line, Rect, Text } from 'react-konva'
import type { ComponentOrientation, ComponentShape } from '../types/shapes'
import { SELECTION_COLOR } from '../utils/constants'
import { getComponentDefinition } from '../types/components'

interface ComponentNodeProps {
  shape: ComponentShape
  selected: boolean
}

export function ComponentNode({ shape, selected }: ComponentNodeProps) {
  const definition = getComponentDefinition(shape.componentType)
  const highlight = selected ? SELECTION_COLOR : undefined
  const fill = shape.fill ?? definition.fillColor
  const stroke = highlight ?? shape.stroke ?? definition.strokeColor
  const label = definition.shortLabel || definition.label
  const fontSize = Math.min(20, Math.max(10, shape.height * 0.14))
  const innerPadding = 8
  const innerWidth = Math.max(10, shape.width - innerPadding * 2)
  const innerHeight = Math.max(10, shape.height - innerPadding * 2)
  const thickness = Math.min(
    Math.max(shape.params?.thickness ?? Math.min(shape.width, shape.height) * 0.25, 20),
    Math.min(shape.width, shape.height) / 2,
  )
  const orientation: ComponentOrientation = shape.params?.orientation ?? 'top-left'

  const renderDetail = () => {
    const cx = innerPadding + innerWidth / 2
    const cy = innerPadding + innerHeight / 2
    const small = Math.min(innerWidth, innerHeight) * 0.2

    switch (shape.componentType) {
      case 'cuba_redonda':
        return (
          <Circle
            x={cx}
            y={cy}
            radius={Math.min(innerWidth, innerHeight) / 2 - 12}
            fill="rgba(255,255,255,0.55)"
            stroke={stroke}
            strokeWidth={0.5}
          />
        )
      case 'cuba_quadrada':
        return (
          <Rect
            x={innerPadding + 6}
            y={innerPadding + 6}
            width={innerWidth - 12}
            height={innerHeight - 12}
            fill="rgba(255,255,255,0.55)"
            stroke={stroke}
            strokeWidth={0.5}
          />
        )
      case 'cuba_dupla':
        return (
          <>
            <Rect
              x={innerPadding + 6}
              y={innerPadding + 6}
              width={(innerWidth - 18) / 2}
              height={innerHeight - 12}
              fill="rgba(255,255,255,0.55)"
              stroke={stroke}
              strokeWidth={0.5}
            />
            <Rect
              x={innerPadding + 12 + (innerWidth - 18) / 2}
              y={innerPadding + 6}
              width={(innerWidth - 18) / 2}
              height={innerHeight - 12}
              fill="rgba(255,255,255,0.55)"
              stroke={stroke}
              strokeWidth={0.5}
            />
          </>
        )
      case 'cooktop_2q':
      case 'cooktop_4q':
      case 'cooktop_5q':
      case 'fogao_2q':
      case 'fogao_4q': {
        const count = shape.componentType === 'cooktop_2q' || shape.componentType === 'fogao_2q'
          ? 2
          : shape.componentType === 'cooktop_4q' || shape.componentType === 'fogao_4q'
          ? 4
          : 5
        const step = innerWidth / (count + 1)
        return (
          <>
            <Rect
              x={innerPadding + 6}
              y={innerPadding + 6}
              width={innerWidth - 12}
              height={innerHeight - 12}
              fill="rgba(200,200,200,0.25)"
              stroke={stroke}
              strokeWidth={0.5}
            />
            {Array.from({ length: count }).map((_, index) => (
              <Circle
                key={index}
                x={innerPadding + 6 + step * (index + 1)}
                y={innerPadding + innerHeight / 2}
                radius={small}
                stroke={stroke}
                strokeWidth={0.5}
                fill="rgba(255,255,255,0.8)"
              />
            ))}
          </>
        )
      }
      case 'caixa_seca':
        return (
          <>
            <Rect
              x={innerPadding + 4}
              y={innerPadding + innerHeight / 2 - 12}
              width={innerWidth - 8}
              height={24}
              fill="rgba(255,255,255,0.55)"
              stroke={stroke}
              strokeWidth={0.5}
            />
            <Line
              points={[
                innerPadding + 6,
                innerPadding + innerHeight / 2,
                innerPadding + innerWidth - 6,
                innerPadding + innerHeight / 2,
              ]}
              stroke={stroke}
              strokeWidth={0.5}
              dash={[6, 4]}
            />
          </>
        )
      case 'bancada_l':
        return (
          <>
            <Rect
              x={innerPadding + 4}
              y={innerPadding + 4}
              width={innerWidth * 0.55}
              height={innerHeight - 8}
              fill="rgba(255,255,255,0.55)"
              stroke={stroke}
              strokeWidth={0.5}
            />
            <Rect
              x={innerPadding + innerWidth * 0.45}
              y={innerPadding + innerHeight * 0.55}
              width={innerWidth * 0.55}
              height={innerHeight * 0.35}
              fill="rgba(255,255,255,0.55)"
              stroke={stroke}
              strokeWidth={0.5}
            />
          </>
        )
      case 'prateleira':
        return (
          <Rect
            x={innerPadding + 6}
            y={innerPadding + innerHeight / 2 - 8}
            width={innerWidth - 12}
            height={16}
            fill="rgba(230,180,120,0.4)"
            stroke={stroke}
            strokeWidth={0.5}
          />
        )
      default:
        return null
    }
  }

  return (
    <Group x={shape.x} y={shape.y} rotation={shape.rotation}>
      <Rect
        x={0}
        y={0}
        width={shape.width}
        height={shape.height}
        fill={shape.componentType === 'bancada_l' ? 'transparent' : fill}
        stroke={stroke}
        strokeWidth={shape.strokeWidth}
        perfectDrawEnabled={false}
      />
      {shape.componentType === 'bancada_l' ? (
        <>
          <Rect
            x={orientation.includes('left') ? 0 : shape.width - thickness}
            y={0}
            width={thickness}
            height={shape.height}
            fill={fill}
            perfectDrawEnabled={false}
          />
          <Rect
            x={0}
            y={orientation.includes('top') ? 0 : shape.height - thickness}
            width={shape.width}
            height={thickness}
            fill={fill}
            perfectDrawEnabled={false}
          />
        </>
      ) : (
        <>
          <Rect
            x={innerPadding}
            y={innerPadding}
            width={innerWidth}
            height={innerHeight}
            stroke={stroke}
            strokeWidth={0.5}
            dash={[4, 4]}
            perfectDrawEnabled={false}
          />
          {renderDetail()}
        </>
      )}
      <Text
        x={0}
        y={shape.height - fontSize - 6}
        width={shape.width}
        text={label}
        fontSize={fontSize}
        fill="#0f172a"
        align="center"
        listening={false}
      />
    </Group>
  )
}
