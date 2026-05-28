import tanqueIcon from '../assets/svgs/tanque.svg?raw'
import fogaoIcon from '../assets/svgs/fogao.svg?raw'
import cubaIcon from '../assets/svgs/cuba.svg?raw'



/**
 * Biblioteca de componentes técnicos para marmoraria
 * Tanque, fogão e cuba.
 */

export type ComponentType = 'tanque' | 'fogao' | 'cuba'

export interface ComponentDefinition {
  id: ComponentType
  label: string
  shortLabel: string
  /** Largura padrão em mm */
  width: number
  /** Altura padrão em mm */
  height: number
  /** SVG visual para preview */
  icon: string
  /** Cores padrão */
  fillColor: string
  strokeColor: string
}

export const COMPONENT_LIBRARY: ComponentDefinition[] = [
  {
    id: 'tanque',
    label: 'Tanque',
    shortLabel: 'Tanque',
    width: 64,
    height: 76,
    fillColor: 'rgba(200, 200, 200, 0.2)',
    strokeColor: '#333',
    icon: tanqueIcon,
  },
  {
    id: 'fogao',
    label: 'Fogão',
    shortLabel: 'Fogão',
    width: 100,
    height: 70,
    fillColor: 'rgba(220, 220, 220, 0.2)',
    strokeColor: '#333',
    icon: fogaoIcon,
  },
  {
    id: 'cuba',
    label: 'Cuba',
    shortLabel: 'Cuba',
    width: 96,
    height: 69,
    fillColor: 'rgba(77, 158, 168, 0.2)',
    strokeColor: '#333',
    icon: cubaIcon,
  },
]

export function getComponentDefinition(type: ComponentType): ComponentDefinition {
  return COMPONENT_LIBRARY.find((c) => c.id === type) ?? COMPONENT_LIBRARY[0]
}
