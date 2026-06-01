import type { Shape } from '../types/shapes'

export type SideColor = 'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'purple' | null
export type SideLabel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface SideInfo {
  label: SideLabel
  color: SideColor
}

export interface SidesConfig {
  [key: string]: SideColor
}

export const SIDE_COLORS = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  yellow: '#eab308',
  orange: '#f97316',
  purple: '#a855f7',
  null: 'transparent',
}

export const SIDE_COLORS_LABELS: Record<SideColor, string> = {
  red: 'Vermelho',
  green: 'Verde',
  blue: 'Azul',
  yellow: 'Amarelo',
  orange: 'Laranja',
  purple: 'Roxo',
  null: 'Sem cor',
}

/** Retorna número de lados baseado no tipo de shape */
export function getSideCount(shape: Shape): number {
  switch (shape.type) {
    case 'rect':
    case 'component':
      return 4 // retângulo: top, right, bottom, left
    case 'circle':
      return 0 // círculo não tem lados discretos
    case 'line':
      // L-shape tem 6 lados, linha simples tem 0
      if (
        shape.closed &&
        typeof shape.width1 === 'number' &&
        typeof shape.width2 === 'number' &&
        typeof shape.height1 === 'number' &&
        typeof shape.height2 === 'number'
      ) {
        return 6
      }
      return 0
    default:
      return 0
  }
}

/** Retorna labels dos lados */
export function getSideLabels(count: number): SideLabel[] {
  const labels: SideLabel[] = ['A', 'B', 'C', 'D', 'E', 'F']
  return labels.slice(0, count)
}

/** Obtém cores dos lados do metadata */
export function getSidesColors(shape: Shape): Record<SideLabel, SideColor> {
  const sidesConfig = (shape.metadata.sidesConfig as SidesConfig) ?? {}
  const count = getSideCount(shape)
  const labels = getSideLabels(count)

  return labels.reduce(
    (acc, label) => {
      acc[label] = sidesConfig[label] ?? null
      return acc
    },
    {} as Record<SideLabel, SideColor>,
  )
}

/** Atualiza cor de um lado específico */
export function updateSideColor(
  shape: Shape,
  sideLabel: SideLabel,
  color: SideColor,
): SidesConfig {
  const current = (shape.metadata.sidesConfig as SidesConfig) ?? {}
  return {
    ...current,
    [sideLabel]: color,
  }
}
