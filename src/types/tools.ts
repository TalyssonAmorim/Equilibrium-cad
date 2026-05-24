export type ToolId =
  | 'select'
  | 'pan'
  | 'line'
  | 'pen'
  | 'rect'
  | 'circle'
  | 'shapes'
  | 'component'
  | 'bancada_l'
  | 'text'
  | 'measure'

export interface ToolDefinition {
  id: ToolId
  label: string
  icon: string
  shortcut?: string
}

export const TOOLS: ToolDefinition[] = [
  { id: 'select', label: 'Seleção', icon: '◎', shortcut: 'V' },
  { id: 'line', label: 'Linha', icon: '╱', shortcut: 'L' },
  { id: 'pen', label: 'Caneta', icon: '✎', shortcut: 'P' },
  { id: 'rect', label: 'Retângulo', icon: '▭', shortcut: 'R' },
  { id: 'circle', label: 'Círculo', icon: '○', shortcut: 'C' },
  { id: 'shapes', label: 'Shapes', icon: '⬡', shortcut: 'B' },
  { id: 'component', label: 'Componente', icon: '⧉', shortcut: 'K' },
  { id: 'bancada_l', label: 'Bancada L', icon: '┐', shortcut: 'Q' },
  { id: 'text', label: 'Texto', icon: 'T', shortcut: 'T' },
  { id: 'measure', label: 'Medida', icon: '↔', shortcut: 'M' },
]
