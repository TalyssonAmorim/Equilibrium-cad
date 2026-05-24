import { useEffect, useState } from 'react'
import { useProjectStore } from '../store/projectStore'

interface ProjectDialogProps {
  open: boolean
  mode: 'new' | 'open'
  onClose: () => void
}

export function ProjectDialog({ open, mode, onClose }: ProjectDialogProps) {
  const [name, setName] = useState('')
  const [client, setClient] = useState('')
  const [address, setAddress] = useState('')
  const createProject = useProjectStore((s) => s.createProject)
  const loadProjectById = useProjectStore((s) => s.loadProjectById)
  const recentProjects = useProjectStore((s) => s.recentProjects)
  const refreshProjectList = useProjectStore((s) => s.refreshProjectList)

  useEffect(() => {
    if (open) {
      void refreshProjectList()
    }
  }, [open, refreshProjectList])

  if (!open) return null

  const handleCreate = () => {
    if (!name.trim()) return
    createProject(name.trim(), client.trim() || undefined)
    if (address.trim()) {
      useProjectStore.getState().updateProjectFields({ address: address.trim() })
    }
    onClose()
  }

  const handleOpen = async (id: string) => {
    const ok = await loadProjectById(id)
    if (ok) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="w-full max-w-md rounded-2xl border border-surface-border bg-surface-elevated p-6 shadow-xl"
        role="dialog"
        aria-modal
        aria-labelledby="project-dialog-title"
      >
        <h2 id="project-dialog-title" className="text-lg font-semibold text-text">
          {mode === 'new' ? 'Novo projeto' : 'Abrir projeto'}
        </h2>

        {mode === 'new' ? (
          <div className="mt-4 space-y-3">
            <label className="block text-sm text-text-muted">
              Nome do projeto
              <input
                className="mt-1 w-full min-h-12 rounded-xl border border-surface-border bg-surface px-4 text-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cozinha Silva — visita 12/05"
                autoFocus
              />
            </label>
            <label className="block text-sm text-text-muted">
              Cliente (opcional)
              <input
                className="mt-1 w-full min-h-12 rounded-xl border border-surface-border bg-surface px-4 text-base"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
            </label>
            <label className="block text-sm text-text-muted">
              Endereço (opcional)
              <input
                className="mt-1 w-full min-h-12 rounded-xl border border-surface-border bg-surface px-4 text-base"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-12 flex-1 rounded-xl text-text-muted active:bg-surface-border"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="min-h-12 flex-1 rounded-xl bg-accent font-semibold text-surface"
              >
                Criar
              </button>
            </div>
          </div>
        ) : (
          <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto">
            {recentProjects.length === 0 && (
              <li className="py-8 text-center text-text-muted">
                Nenhum projeto salvo localmente
              </li>
            )}
            {recentProjects.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => void handleOpen(p.id)}
                  className="flex min-h-14 w-full flex-col rounded-xl border border-surface-border px-4 py-3 text-left active:bg-surface"
                >
                  <span className="font-medium text-text">{p.name}</span>
                  <span className="text-xs text-text-muted">
                    {new Date(p.updatedAt).toLocaleString('pt-BR')}
                  </span>
                </button>
              </li>
            ))}
            <button
              type="button"
              onClick={onClose}
              className="mt-2 min-h-12 w-full rounded-xl text-text-muted"
            >
              Fechar
            </button>
          </ul>
        )}
      </div>
    </div>
  )
}
