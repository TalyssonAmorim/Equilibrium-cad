import { Group, Image as KonvaImage, Rect, Text } from 'react-konva'
import { useMemo } from 'react'
import useImage from 'use-image'
import type { ComponentShape } from '../types/shapes'
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

  const svgDataUrl = useMemo(() => {
    if (!definition.icon) return null
    const svg = definition.icon.trim()
    const base64 = window.btoa(unescape(encodeURIComponent(svg)))
    return `data:image/svg+xml;base64,${base64}`
  }, [definition.icon])

  const [svgImage] = useImage(svgDataUrl ?? '')

  return (
    <Group x={shape.x} y={shape.y} rotation={shape.rotation}>
      {svgImage && (
        <KonvaImage
          image={svgImage}
          x={innerPadding}
          y={innerPadding}
          width={innerWidth}
          height={innerHeight}
          listening={false}
        />
      )}
    

    </Group>
  )
}
