import { Suspense, lazy, useCallback, useRef, useEffect } from 'react'
import { useProjectStore } from '../store/projectStore'

const Excalidraw = lazy(async () => {
  const mod = await import('@excalidraw/excalidraw')
  // Excalidraw may export the component as a named export; normalize to default
  return { default: (mod as any).Excalidraw ?? (mod as any).default ?? mod }
})

export function ExcalidrawPanel({ onClose }: { onClose: () => void }) {
  const project = useProjectStore((s) => s.project)
  const setExcalidrawScene = useProjectStore((s) => s.setExcalidrawScene)
  const saveCurrentProject = useProjectStore((s) => s.saveCurrentProject)

  const sceneRef = useRef<any>(project?.excalidraw ?? null)

  useEffect(() => {
    sceneRef.current = project?.excalidraw ?? null
  }, [project?.excalidraw])

  useEffect(() => {
    // load Excalidraw CSS from CDN if not already present
    const id = 'excalidraw-cdn-css'
    if (!document.getElementById(id)) {
      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/@excalidraw/excalidraw/dist/excalidraw.min.css'
      document.head.appendChild(link)
    }
  }, [])

  const handleExport = useCallback(() => {
    // placeholder
    // eslint-disable-next-line no-console
    console.log('Excalidraw export placeholder')
  }, [])

  const handleSave = useCallback(async () => {
    if (!sceneRef.current) return
    setExcalidrawScene(sceneRef.current)
    await saveCurrentProject()
    // eslint-disable-next-line no-console
    console.log('Excalidraw salvo no projeto')
  }, [setExcalidrawScene, saveCurrentProject])

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/40 p-6">
      <div className="relative h-full w-full max-w-6xl rounded bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-surface-border p-2">
          <div className="text-sm font-semibold">Excalidraw</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="rounded px-3 py-1 text-sm text-text-muted"
            >
              Exportar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded px-3 py-1 text-sm text-text-muted"
            >
              Salvar no projeto
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-accent/20 px-3 py-1 text-sm font-medium text-accent"
            >
              Fechar
            </button>
          </div>
        </div>

        <div className="h-[calc(100%-44px)]">
          <Suspense fallback={<div className="p-6">Carregando editor...</div>}>
            {
              (() => {
                const ExcalidrawAny: any = Excalidraw
                return (
                  <ExcalidrawAny
                    initialData={project?.excalidraw}
                    onChange={(elements: any, state: any) => {
                      sceneRef.current = { elements, appState: state }
                    }}
                  />
                )
              })()
            }
          </Suspense>
        </div>
      </div>
    </div>
  )
}
