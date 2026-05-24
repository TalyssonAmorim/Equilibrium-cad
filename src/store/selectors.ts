import type { Shape } from '../types/shapes'
import type { ProjectState } from './projectStore'

/** Referência estável — evita loop infinito com `?? []` em seletores Zustand */
export const EMPTY_SHAPES: readonly Shape[] = []

export function selectProjectShapes(state: ProjectState): readonly Shape[] {
  return state.project?.shapes ?? EMPTY_SHAPES
}
