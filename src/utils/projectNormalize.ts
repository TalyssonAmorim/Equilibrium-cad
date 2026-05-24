import {
  DEFAULT_SITE_CONDITIONS,
  type Project,
  type SiteConditions,
} from '../types/project'

export function normalizeProject(raw: Project): Project {
  const conditions: SiteConditions = {
    ...DEFAULT_SITE_CONDITIONS,
    ...(raw.conditions ?? {}),
  }
  return {
    ...raw,
    conditions,
    clientName: raw.clientName ?? '',
    address: raw.address ?? '',
    phone: raw.phone ?? '',
  }
}
