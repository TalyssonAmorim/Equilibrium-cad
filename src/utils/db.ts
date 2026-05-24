import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Project, ProjectSummary } from '../types/project'
import { normalizeProject } from './projectNormalize'

interface MarmorariaDB extends DBSchema {
  projects: {
    key: string
    value: Project
    indexes: { 'by-updated': string }
  }
}

const DB_NAME = 'marmoraria-cad'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<MarmorariaDB>> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<MarmorariaDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore('projects', { keyPath: 'id' })
        store.createIndex('by-updated', 'updatedAt')
      },
    })
  }
  return dbPromise
}

export async function saveProject(project: Project): Promise<void> {
  const db = await getDb()
  await db.put('projects', project)
}

export async function loadProject(id: string): Promise<Project | undefined> {
  const db = await getDb()
  const raw = await db.get('projects', id)
  return raw ? normalizeProject(raw) : undefined
}

export async function listProjects(): Promise<ProjectSummary[]> {
  const db = await getDb()
  const all = await db.getAll('projects')
  return all
    .map((p) => ({ id: p.id, name: p.name, updatedAt: p.updatedAt }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('projects', id)
}
