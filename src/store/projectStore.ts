import { create } from 'zustand'
import {
  DEFAULT_SITE_CONDITIONS,
  type Project,
  type SiteConditions,
  type YesNo,
} from '../types/project'
import type { Shape } from '../types/shapes'
import { generateId } from '../utils/geometry'
import { saveProject, loadProject, listProjects } from '../utils/db'
import {
  exportProjectToTemplatePdf,
} from '../utils/templateExport'
import { createMeasurementForLine, normalizeShape } from '../utils/shapes'
import { isLineShape } from '../types/shapes'

const MAX_UNDO = 50

export interface ProjectState {
  project: Project | null
  isDirty: boolean
  isSaving: boolean
  recentProjects: { id: string; name: string; updatedAt: string }[]
  undoStack: Shape[][]

  createProject: (name: string, clientName?: string) => void
  loadProjectById: (id: string) => Promise<boolean>
  refreshProjectList: () => Promise<void>
  setProjectName: (name: string) => void
  updateProjectFields: (
    fields: Partial<
      Pick<Project, 'clientName' | 'address' | 'phone' | 'name'>
    > & { conditions?: Partial<SiteConditions> },
  ) => void
  setCondition: (key: keyof SiteConditions, value: YesNo) => void
  addShape: (shape: Shape, withAutoMeasure?: boolean) => void
  addShapes: (shapes: Shape[]) => void
  updateShape: (
    id: string,
    patch: Partial<Shape>,
    options?: { recordUndo?: boolean },
  ) => void
  captureUndoSnapshot: () => void
  removeShapes: (ids: string[]) => void
  setShapes: (shapes: Shape[]) => void
  saveCurrentProject: () => Promise<void>
  markClean: () => void
  undo: () => void
  canUndo: () => boolean
}

function newProject(name: string, clientName?: string): Project {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    name,
    clientName: clientName ?? '',
    address: '',
    phone: '',
    conditions: { ...DEFAULT_SITE_CONDITIONS },
    shapes: [],
    createdAt: now,
    updatedAt: now,
  }
}

function cloneShapes(shapes: Shape[]): Shape[] {
  return structuredClone(shapes)
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,
  isDirty: false,
  isSaving: false,
  recentProjects: [],
  undoStack: [],

  createProject: (name, clientName) => {
    set({ project: newProject(name, clientName), isDirty: true, undoStack: [] })
  },

  loadProjectById: async (id) => {
    const loaded = await loadProject(id)
    if (!loaded) return false
    set({ project: loaded, isDirty: false, undoStack: [] })
    return true
  },

  refreshProjectList: async () => {
    const list = await listProjects()
    set({ recentProjects: list })
  },

  setProjectName: (name) => {
    get().updateProjectFields({ name })
  },

  updateProjectFields: (fields) => {
    const { project } = get()
    if (!project) return
    const { conditions, ...rest } = fields
    const nextConditions = conditions
      ? { ...project.conditions, ...conditions }
      : project.conditions

    set({
      project: {
        ...project,
        ...rest,
        conditions: nextConditions,
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    })
  },

  setCondition: (key, value) => {
    const { project } = get()
    if (!project) return
    set({
      project: {
        ...project,
        conditions: { ...project.conditions, [key]: value },
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    })
  },

  addShape: (shape, withAutoMeasure = false) => {
    get().addShapes(
      withAutoMeasure && isLineShape(shape)
        ? [shape, createMeasurementForLine(shape)]
        : [shape],
    )
  },

  addShapes: (newShapes) => {
    const { project, undoStack } = get()
    if (!project || newShapes.length === 0) return
    set({
      undoStack: [...undoStack.slice(-MAX_UNDO + 1), cloneShapes(project.shapes)],
      project: {
        ...project,
        shapes: [...project.shapes, ...newShapes],
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    })
  },

  captureUndoSnapshot: () => {
    const { project, undoStack } = get()
    if (!project) return
    set({
      undoStack: [...undoStack.slice(-MAX_UNDO + 1), cloneShapes(project.shapes)],
    })
  },

  updateShape: (id, patch, options) => {
    const { project, undoStack } = get()
    if (!project) return
    const recordUndo = options?.recordUndo !== false
    set({
      undoStack: recordUndo
        ? [...undoStack.slice(-MAX_UNDO + 1), cloneShapes(project.shapes)]
        : undoStack,
      project: {
        ...project,
        shapes: project.shapes.map((s) =>
          s.id === id ? normalizeShape({ ...s, ...patch } as Shape) : s,
        ),
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    })
  },

  removeShapes: (ids) => {
    const { project, undoStack } = get()
    if (!project) return
    const idSet = new Set(ids)
    set({
      undoStack: [...undoStack.slice(-MAX_UNDO + 1), cloneShapes(project.shapes)],
      project: {
        ...project,
        shapes: project.shapes.filter((s) => !idSet.has(s.id)),
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    })
  },

  setShapes: (shapes) => {
    const { project, undoStack } = get()
    if (!project) return
    set({
      undoStack: [...undoStack.slice(-MAX_UNDO + 1), cloneShapes(project.shapes)],
      project: { ...project, shapes, updatedAt: new Date().toISOString() },
      isDirty: true,
    })
  },

  saveCurrentProject: async () => {
    const { project } = get()
    if (!project) return
    set({ isSaving: true })
    try {
      const toSave = { ...project, updatedAt: new Date().toISOString() }
      await saveProject(toSave)
      set({ project: toSave, isDirty: false })
      await get().refreshProjectList()
      await exportProjectToTemplatePdf(toSave, true)
    } finally {
      set({ isSaving: false })
    }
  },

  markClean: () => set({ isDirty: false }),

  canUndo: () => get().undoStack.length > 0,

  undo: () => {
    const { project, undoStack } = get()
    if (!project || undoStack.length === 0) return
    const previous = undoStack[undoStack.length - 1]
    set({
      undoStack: undoStack.slice(0, -1),
      project: {
        ...project,
        shapes: cloneShapes(previous),
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    })
  },
}))
