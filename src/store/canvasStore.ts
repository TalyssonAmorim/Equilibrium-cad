import { create } from 'zustand'
import type Konva from 'konva'
import type { Camera, ViewportSize } from '../types/camera'
import type { EdgeFinishType } from '../types/edgeFinish'
import type { ComponentType } from '../types/components'
import type { ToolId } from '../types/tools'
import { clampScale, createDefaultCamera } from '../utils/camera'
import { MAX_SCALE, MIN_SCALE } from '../utils/constants'

export type DraftState =
  | {
      kind: 'line' | 'rect' | 'measure'
      startX: number
      startY: number
      currentX: number
      currentY: number
    }
  | {
      kind: 'circle'
      centerX: number
      centerY: number
      currentX: number
      currentY: number
    }
  | {
      kind: 'edgeFinish'
      edgeType: EdgeFinishType
      startX: number
      startY: number
      currentX: number
      currentY: number
    }
  | {
      kind: 'component'
      componentType: ComponentType
      startX: number
      startY: number
      currentX: number
      currentY: number
    }
  | {
      kind: 'lshape'
      startX: number
      startY: number
      currentX: number
      currentY: number
    }
  | {
      kind: 'text'
      x: number
      y: number
    }
  | {
      kind: 'pen'
      points: number[]
    }
  | {
      kind: 'roda-banca'
      startX: number
      startY: number
      currentX: number
      currentY: number
    }

interface CanvasState {
  camera: Camera
  viewport: ViewportSize
  activeTool: ToolId
  selectedIds: string[]
  snapEnabled: boolean
  draft: DraftState | null
  rodaBancaHeightCm: number
  selectedEdgeFinish: EdgeFinishType
  selectedComponent: ComponentType | null
  shapesPanelOpen: boolean
  componentPanelOpen: boolean
  toolboxOpen: boolean
  propertiesPanelOpen: boolean
  isPanning: boolean
  isResizing: boolean
  stageRef: { current: Konva.Stage | null }

  setViewport: (size: ViewportSize) => void
  setCamera: (camera: Partial<Camera>) => void
  panByScreen: (dx: number, dy: number) => void
  zoomAtScreen: (screenX: number, screenY: number, factor: number) => void
  setActiveTool: (tool: ToolId) => void
  setSelectedIds: (ids: string[]) => void
  toggleSelection: (id: string) => void
  clearSelection: () => void
  setSnapEnabled: (enabled: boolean) => void
  setRodaBancaHeight: (height: number) => void
  setDraft: (draft: DraftState | null) => void
  setSelectedEdgeFinish: (type: EdgeFinishType) => void
  setSelectedComponent: (type: ComponentType | null) => void
  setShapesPanelOpen: (open: boolean) => void
  setComponentPanelOpen: (open: boolean) => void
  setToolboxOpen: (open: boolean) => void
  setPropertiesPanelOpen: (open: boolean) => void
  setIsPanning: (panning: boolean) => void
  setIsResizing: (resizing: boolean) => void
  setStageRef: (stage: Konva.Stage | null) => void
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  camera: createDefaultCamera(),
  viewport: { width: 0, height: 0 },
  activeTool: 'select',
  selectedIds: [],
  snapEnabled: true,
  draft: null,
  rodaBancaHeightCm: 10,
  selectedEdgeFinish: 'reto',
  selectedComponent: null,
  shapesPanelOpen: false,
  componentPanelOpen: false,
  toolboxOpen: true,
  propertiesPanelOpen: false,
  isPanning: false,
  isResizing: false,
  stageRef: { current: null },

  setViewport: (viewport) => set({ viewport }),

  setCamera: (partial) =>
    set((s) => ({ camera: { ...s.camera, ...partial } })),

  panByScreen: (_dx, dy) => {
    const { camera } = get()
    set({
      camera: {
        ...camera,
        x: 0,
        y: camera.y - dy / camera.scale,
      },
    })
  },

  zoomAtScreen: (_screenX, screenY, factor) => {
    const { camera, viewport } = get()
    const worldBeforeY =
      camera.y + (screenY - viewport.height / 2) / camera.scale
    const newScale = clampScale(camera.scale * factor, MIN_SCALE, MAX_SCALE)
    set({
      camera: {
        x: 0,
        y: worldBeforeY - (screenY - viewport.height / 2) / newScale,
        scale: newScale,
      },
    })
  },

  setActiveTool: (activeTool) => {
    set({
      activeTool,
      draft: null,
      shapesPanelOpen: activeTool === 'shapes',
      componentPanelOpen: activeTool === 'component',
      toolboxOpen: false,
    })
    if (activeTool !== 'select') {
      set({ selectedIds: [] })
    }
  },

  setSelectedIds: (selectedIds) => set({ selectedIds }),
  toggleSelection: (id) => {
    const { selectedIds } = get()
    set({
      selectedIds: selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    })
  },
  clearSelection: () => set({ selectedIds: [] }),
  setSnapEnabled: (snapEnabled) => set({ snapEnabled }),
  setRodaBancaHeight: (rodaBancaHeightCm) => set({ rodaBancaHeightCm }),
  setDraft: (draft) => set({ draft }),
  setSelectedEdgeFinish: (selectedEdgeFinish) => set({ selectedEdgeFinish }),
  setSelectedComponent: (selectedComponent) => set({ selectedComponent }),
  setShapesPanelOpen: (shapesPanelOpen) => set({ shapesPanelOpen }),
  setComponentPanelOpen: (componentPanelOpen) => set({ componentPanelOpen }),
  setToolboxOpen: (toolboxOpen) => set({ toolboxOpen }),
  setPropertiesPanelOpen: (propertiesPanelOpen) => set({ propertiesPanelOpen }),
  setIsPanning: (isPanning) => set({ isPanning }),
  setIsResizing: (isResizing) => set({ isResizing }),
  setStageRef: (stage) => {
    get().stageRef.current = stage
  },
}))
