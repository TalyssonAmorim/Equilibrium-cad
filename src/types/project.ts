import type { Shape } from './shapes'

export type YesNo = 'sim' | 'nao' | null

export interface SiteConditions {
  revPronto: YesNo
  pisoPronto: YesNo
  furoTorneira: YesNo
  marcenariaPronta: YesNo
}

export const DEFAULT_SITE_CONDITIONS: SiteConditions = {
  revPronto: null,
  pisoPronto: null,
  furoTorneira: null,
  marcenariaPronta: null,
}

export interface Project {
  id: string
  name: string
  clientName?: string
  address?: string
  phone?: string
  conditions: SiteConditions
  shapes: Shape[]
  createdAt: string
  updatedAt: string
}

export interface ProjectSummary {
  id: string
  name: string
  updatedAt: string
}
