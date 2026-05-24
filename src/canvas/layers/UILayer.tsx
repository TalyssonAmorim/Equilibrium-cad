import { memo } from 'react'
import { Layer, Line, Rect, Circle, Text, Group, Path } from 'react-konva'
import { getEdgeFinishDefinition } from '../../types/edgeFinish'
import { EDGE_FINISH_VIEWBOX } from '../../types/edgeFinish'
import { getComponentDefinition } from '../../types/components'
import { useCanvasStore } from '../../store/canvasStore'
import { useProjectStore } from '../../store/projectStore'
import { selectProjectShapes } from '../../store/selectors'
import { getShapeBounds } from '../../utils/shapes'
import { DEFAULT_STROKE_WIDTH, SELECTION_COLOR } from '../../utils/constants'
import { WorldGroup } from '../WorldGroup'
import { formatMm } from '../../utils/geometry'
import { getResizeHandles, getRotateHandle } from '../../utils/transform'

const HANDLE_RADIUS_MM = 5

function DraftPreview() {
  const draft = useCanvasStore((s) => s.draft)
  if (!draft) return null

  if (draft.kind === 'line' || draft.kind === 'measure') {
    const len = Math.hypot(
      draft.currentX - draft.startX,
      draft.currentY - draft.startY,
    )
    return (
      <>
        <Line
          points={[draft.startX, draft.startY, draft.currentX, draft.currentY]}
          stroke="#475569"
          strokeWidth={DEFAULT_STROKE_WIDTH}
          dash={[6, 4]}
          opacity={0.9}
          listening={false}
        />
        <Text
          x={(draft.startX + draft.currentX) / 2}
          y={(draft.startY + draft.currentY) / 2 - 12}
          text={formatMm(len)}
          fontSize={11}
          fill="#64748b"
          listening={false}
        />
      </>
    )
  }

  if (draft.kind === 'pen') {
    return (
      <Line
        points={draft.points}
        stroke="#475569"
        strokeWidth={DEFAULT_STROKE_WIDTH}
        dash={[6, 4]}
        opacity={0.9}
        lineCap="round"
        lineJoin="round"
        listening={false}
      />
    )
  }

  if (draft.kind === 'circle') {
    const radius = Math.hypot(
      draft.currentX - draft.centerX,
      draft.currentY - draft.centerY,
    )
    return (
      <>
        <Circle
          x={draft.centerX}
          y={draft.centerY}
          radius={radius}
          stroke="#475569"
          strokeWidth={DEFAULT_STROKE_WIDTH}
          dash={[6, 4]}
          fill="rgba(51, 65, 85, 0.08)"
          listening={false}
        />
        <Line
          points={[draft.centerX, draft.centerY, draft.currentX, draft.currentY]}
          stroke="#94a3b8"
          strokeWidth={0.4}
          dash={[4, 4]}
          listening={false}
        />
        <Text
          x={draft.centerX + radius / 2}
          y={draft.centerY - 14}
          text={`R ${formatMm(radius)}`}
          fontSize={11}
          fill="#64748b"
          listening={false}
        />
      </>
    )
  }

  if (draft.kind === 'edgeFinish') {
    const x = Math.min(draft.startX, draft.currentX)
    const y = Math.min(draft.startY, draft.currentY)
    const w = Math.max(Math.abs(draft.currentX - draft.startX), 1)
    const h = Math.max(Math.abs(draft.currentY - draft.startY), 1)
    const def = getEdgeFinishDefinition(draft.edgeType)
    const scaleX = w / EDGE_FINISH_VIEWBOX.width
    const scaleY = h / EDGE_FINISH_VIEWBOX.height
    return (
      <Group x={x} y={y} listening={false}>
        <Rect
          width={w}
          height={h}
          stroke="#94a3b8"
          strokeWidth={DEFAULT_STROKE_WIDTH}
          dash={[4, 4]}
          listening={false}
        />
        <Path
          data={def.path}
          scaleX={scaleX}
          scaleY={scaleY}
          fill="rgba(51, 65, 85, 0.1)"
          stroke="#475569"
          strokeWidth={0.6}
          listening={false}
        />
      </Group>
    )
  }

  if (draft.kind === 'rect') {
    const x = Math.min(draft.startX, draft.currentX)
    const y = Math.min(draft.startY, draft.currentY)
    const w = Math.abs(draft.currentX - draft.startX)
    const h = Math.abs(draft.currentY - draft.startY)
    return (
      <>
        <Rect
          x={x}
          y={y}
          width={w}
          height={h}
          stroke="#475569"
          strokeWidth={DEFAULT_STROKE_WIDTH}
          dash={[6, 4]}
          fill="rgba(51, 65, 85, 0.08)"
          listening={false}
        />
        <Text
          x={x + w / 2}
          y={y + h / 2}
          text={`${formatMm(w)} × ${formatMm(h)}`}
          fontSize={11}
          fill="#64748b"
          offsetX={40}
          listening={false}
        />
      </>
    )
  }

  if (draft.kind === 'component') {
    const x = Math.min(draft.startX, draft.currentX)
    const y = Math.min(draft.startY, draft.currentY)
    const w = Math.abs(draft.currentX - draft.startX)
    const h = Math.abs(draft.currentY - draft.startY)
    const def = getComponentDefinition(draft.componentType)
    return (
      <Group x={x} y={y} listening={false}>
        <Rect
          width={w}
          height={h}
          stroke="#475569"
          strokeWidth={DEFAULT_STROKE_WIDTH}
          dash={[6, 4]}
          fill="rgba(51, 65, 85, 0.08)"
          listening={false}
        />
        <Text
          x={w / 2}
          y={h / 2 - 8}
          text={def.shortLabel}
          fontSize={12}
          fill="#64748b"
          align="center"
          width={w}
          listening={false}
        />
        <Text
          x={w / 2}
          y={h / 2 + 10}
          text={`${formatMm(w)} × ${formatMm(h)}`}
          fontSize={10}
          fill="#64748b"
          align="center"
          width={w}
          listening={false}
        />
      </Group>
    )
  }

  return null
}

function SelectionOverlay() {
  const selectedIds = useCanvasStore((s) => s.selectedIds)
  const shapes = useProjectStore(selectProjectShapes)

  if (selectedIds.length !== 1) return null

  const shape = shapes.find((s) => s.id === selectedIds[0])
  if (!shape || shape.layer !== 'drawing') return null

  const bounds = getShapeBounds(shape)
  if (!bounds) return null

  const pad = 4
  const handles = getResizeHandles(shape)

  return (
    <>
      <Rect
        x={bounds.minX - pad}
        y={bounds.minY - pad}
        width={bounds.maxX - bounds.minX + pad * 2}
        height={bounds.maxY - bounds.minY + pad * 2}
        stroke={SELECTION_COLOR}
        strokeWidth={0.5}
        dash={[4, 4]}
        listening={false}
      />
      {handles.map((h) => (
        <Circle
          key={h.id}
          x={h.x}
          y={h.y}
          radius={HANDLE_RADIUS_MM}
          fill="#0f172a"
          stroke={SELECTION_COLOR}
          strokeWidth={0.6}
          listening={false}
        />
      ))}
      {(() => {
        const rotateHandle = getRotateHandle(shape)
        if (!rotateHandle) return null
        return (
          <Circle
            key={rotateHandle.id}
            x={rotateHandle.x}
            y={rotateHandle.y}
            radius={HANDLE_RADIUS_MM + 1}
            fill="#f8fafc"
            stroke={SELECTION_COLOR}
            strokeWidth={0.8}
            listening={false}
          />
        )
      })()}
    </>
  )
}

function UILayerInner() {
  return (
    <Layer listening={false}>
      <WorldGroup>
        <DraftPreview />
        <SelectionOverlay />
      </WorldGroup>
    </Layer>
  )
}

export const UILayer = memo(UILayerInner)
