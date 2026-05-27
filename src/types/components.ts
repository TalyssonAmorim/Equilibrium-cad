/**
 * Biblioteca de componentes técnicos para marmoraria
 * Cubas, cooktops, fogões, calhas, etc.
 */

export type ComponentType =
  | 'cuba_redonda'
  | 'cuba_quadrada'
  | 'cuba_dupla'
  | 'cooktop_2q'
  | 'cooktop_4q'
  | 'cooktop_5q'
  | 'fogao_2q'
  | 'fogao_4q'
  | 'caixa_seca'
  | 'prateleira'

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
    id: 'cuba_redonda',
    label: 'Cuba Redonda',
    shortLabel: 'Cuba Ø',
    width: 400,
    height: 400,
    fillColor: 'rgba(200, 200, 200, 0.2)',
    strokeColor: '#333',
    icon: `
      <circle cx="200" cy="200" r="150" fill="rgba(100, 100, 100, 0.3)" stroke="#333" stroke-width="2"/>
    `,
  },
  {
    id: 'cuba_quadrada',
    label: 'Cuba Quadrada',
    shortLabel: 'Cuba □',
    width: 380,
    height: 380,
    fillColor: 'rgba(200, 200, 200, 0.2)',
    strokeColor: '#333',
    icon: `
      <rect x="50" y="50" width="300" height="300" fill="rgba(100, 100, 100, 0.3)" stroke="#333" stroke-width="2"/>
    `,
  },
  {
    id: 'cuba_dupla',
    label: 'Cuba Dupla',
    shortLabel: 'Cuba 2x',
    width: 700,
    height: 380,
    fillColor: 'rgba(200, 200, 200, 0.2)',
    strokeColor: '#333',
    icon: `
      <rect x="30" y="50" width="280" height="300" fill="rgba(100, 100, 100, 0.3)" stroke="#333" stroke-width="2"/>
      <rect x="350" y="50" width="280" height="300" fill="rgba(100, 100, 100, 0.3)" stroke="#333" stroke-width="2"/>
    `,
  },
  {
    id: 'cooktop_2q',
    label: 'Cooktop 2 Queimadores',
    shortLabel: 'Cook 2q',
    width: 300,
    height: 500,
    fillColor: 'rgba(100, 100, 100, 0.2)',
    strokeColor: '#333',
    icon: `
      <rect x="50" y="50" width="200" height="350" fill="rgba(50, 50, 50, 0.3)" stroke="#333" stroke-width="2"/>
      <circle cx="100" cy="120" r="25" fill="none" stroke="#333" stroke-width="1.5"/>
      <circle cx="200" cy="120" r="25" fill="none" stroke="#333" stroke-width="1.5"/>
    `,
  },
  {
    id: 'cooktop_4q',
    label: 'Cooktop 4 Queimadores',
    shortLabel: 'Cook 4q',
    width: 600,
    height: 500,
    fillColor: 'rgba(100, 100, 100, 0.2)',
    strokeColor: '#333',
    icon: `
      <rect x="50" y="50" width="500" height="350" fill="rgba(50, 50, 50, 0.3)" stroke="#333" stroke-width="2"/>
      <circle cx="100" cy="120" r="25" fill="none" stroke="#333" stroke-width="1.5"/>
      <circle cx="200" cy="120" r="25" fill="none" stroke="#333" stroke-width="1.5"/>
      <circle cx="400" cy="120" r="25" fill="none" stroke="#333" stroke-width="1.5"/>
      <circle cx="500" cy="120" r="25" fill="none" stroke="#333" stroke-width="1.5"/>
    `,
  },
  {
    id: 'cooktop_5q',
    label: 'Cooktop 5 Queimadores',
    shortLabel: 'Cook 5q',
    width: 700,
    height: 500,
    fillColor: 'rgba(100, 100, 100, 0.2)',
    strokeColor: '#333',
    icon: `
      <rect x="50" y="50" width="600" height="350" fill="rgba(50, 50, 50, 0.3)" stroke="#333" stroke-width="2"/>
      <circle cx="80" cy="120" r="20" fill="none" stroke="#333" stroke-width="1.5"/>
      <circle cx="160" cy="120" r="20" fill="none" stroke="#333" stroke-width="1.5"/>
      <circle cx="350" cy="120" r="20" fill="none" stroke="#333" stroke-width="1.5"/>
      <circle cx="540" cy="120" r="20" fill="none" stroke="#333" stroke-width="1.5"/>
      <circle cx="620" cy="120" r="20" fill="none" stroke="#333" stroke-width="1.5"/>
    `,
  },
  {
    id: 'fogao_2q',
    label: 'Fogão 2 Queimadores',
    shortLabel: 'Fogão 2q',
    width: 350,
    height: 550,
    fillColor: 'rgba(100, 100, 100, 0.2)',
    strokeColor: '#333',
    icon: `
      <rect x="40" y="40" width="270" height="200" fill="rgba(50, 50, 50, 0.3)" stroke="#333" stroke-width="2"/>
      <rect x="40" y="250" width="270" height="200" fill="rgba(150, 100, 100, 0.3)" stroke="#333" stroke-width="2"/>
      <circle cx="90" cy="90" r="20" fill="none" stroke="#333" stroke-width="1.5"/>
      <circle cx="190" cy="90" r="20" fill="none" stroke="#333" stroke-width="1.5"/>
    `,
  },
  {
    id: 'fogao_4q',
    label: 'Fogão 4 Queimadores',
    shortLabel: 'Fogão 4q',
    width: 600,
    height: 550,
    fillColor: 'rgba(100, 100, 100, 0.2)',
    strokeColor: '#333',
    icon: `
      <rect x="40" y="40" width="520" height="200" fill="rgba(50, 50, 50, 0.3)" stroke="#333" stroke-width="2"/>
      <rect x="40" y="250" width="520" height="200" fill="rgba(150, 100, 100, 0.3)" stroke="#333" stroke-width="2"/>
      <circle cx="90" cy="90" r="20" fill="none" stroke="#333" stroke-width="1.5"/>
      <circle cx="190" cy="90" r="20" fill="none" stroke="#333" stroke-width="1.5"/>
      <circle cx="390" cy="90" r="20" fill="none" stroke="#333" stroke-width="1.5"/>
      <circle cx="490" cy="90" r="20" fill="none" stroke="#333" stroke-width="1.5"/>
    `,
  },
  {
    id: 'caixa_seca',
    label: 'Caixa Seca (Calha)',
    shortLabel: 'Caixa Seca',
    width: 800,
    height: 100,
    fillColor: 'rgba(100, 100, 100, 0.2)',
    strokeColor: '#333',
    icon: `
      <rect x="20" y="30" width="760" height="50" fill="rgba(100, 100, 100, 0.3)" stroke="#333" stroke-width="2"/>
      <line x1="200" y1="30" x2="200" y2="80" stroke="#999" stroke-width="1"/>
      <line x1="400" y1="30" x2="400" y2="80" stroke="#999" stroke-width="1"/>
      <line x1="600" y1="30" x2="600" y2="80" stroke="#999" stroke-width="1"/>
    `,
  },
  {
    id: 'prateleira',
    label: 'Prateleira',
    shortLabel: 'Prat.',
    width: 600,
    height: 300,
    fillColor: 'rgba(200, 150, 100, 0.2)',
    strokeColor: '#8B6F47',
    icon: `
      <rect x="30" y="50" width="540" height="30" fill="rgba(180, 140, 80, 0.3)" stroke="#8B6F47" stroke-width="2"/>
      <line x1="30" y1="65" x2="570" y2="65" stroke="#8B6F47" stroke-width="1"/>
      <line x1="30" y1="80" x2="570" y2="80" stroke="#8B6F47" stroke-width="1"/>
    `,
  },
]

export function getComponentDefinition(type: ComponentType): ComponentDefinition {
  return COMPONENT_LIBRARY.find((c) => c.id === type) ?? COMPONENT_LIBRARY[0]
}
