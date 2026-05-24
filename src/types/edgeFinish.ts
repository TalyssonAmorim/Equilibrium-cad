export type EdgeFinishType =
  | 'reto'
  | 'reto_45'
  | 'reto_duplo'
  | 'boleado_simples'
  | 'meio_boleado_simples'
  | 'boleado_duplo'
  | 'meio_boleado_duplo'
  | 'reto_45_10cm'

export interface EdgeFinishDefinition {
  id: EdgeFinishType
  label: string
  shortLabel: string
  /** Path SVG normalizado */
  path: string
}

/**
 * SVG baseado nos desenhos enviados:
 *
 * 1. Reto simples deslocado
 * 2. Corte 45° interno
 * 3. Corte 45° externo
 * 4. Perfil elevado
 * 5. Linha dupla (símbolo técnico)
 */

export const EDGE_FINISH_CATALOG: EdgeFinishDefinition[] = [
  {
    id: 'reto',
    label: '',
    shortLabel: '',
    path: `
      M 10 40
      L 10 70
      L 60 70
      L 60 40
      Z

      M 40 10
      L 40 40
      L 90 40
      L 90 10
      Z
    `,
  },

  {
    id: 'reto_45',
    label: '',
    shortLabel: '',
    path: `
      M 10 40
      L 10 70
      L 50 70
      L 70 50
      L 80 39
      Z

      M 50 70
      L 50 100
      L 80 100
      L 80 40
      L 70 50
    `,
  },

  {
    id: 'reto_duplo',
    label: '',
    shortLabel: '',
    path: `
      M 30 50
      L 30 70
      L 50 70
      L 70 50
   
      Z
      M 50 70
      L 50 90
     
      M 10 90
      L 10 70
      L 50 70
      L 70 50
      L 70 90
      Z
    `,
  },

  {
    id: 'boleado_simples',
    label: '',
    shortLabel: '',
    path: `
      M 30 50
      L 30 70
      L 50 70
      L 70 50
   
      Z
      M 50 70
      L 50 115
      L 70 115
      L 70 50

  
      Z
     
      M 10 90
      L 10 70
      L 50 70
      L 50 90
      Z
    `,
  },
    {
    id: 'meio_boleado_simples',
    label: '',
    shortLabel: '',
    path: `
      M 50 35
      A 15 15 0 1 1 49.9 35
      Z

      M 50 42
      L 50 58

      M 42 50
      L 58 50
      `,
  },
  
]

export const EDGE_FINISH_VIEWBOX = {
  width: 100,
  height: 100,
}

export function getEdgeFinishDefinition(
  type: EdgeFinishType,
): EdgeFinishDefinition {
  return (
    EDGE_FINISH_CATALOG.find((d) => d.id === type) ??
    EDGE_FINISH_CATALOG[0]
  )
} 