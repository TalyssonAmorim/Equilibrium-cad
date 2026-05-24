import { useRef, useState } from 'react'
import { InfiniteCanvas } from '../canvas/InfiniteCanvas'
import { useViewportSize } from '../hooks/useViewportSize'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { Toolbar } from './Toolbar'
import { FloatingToolbar } from './FloatingToolbar'
import { ToolboxMenu } from './ToolboxMenu'
import { FloatingProperties } from './FloatingProperties'
import { ProjectDialog } from './ProjectDialog'
import { EdgeFinishPanel } from './EdgeFinishPanel'
import { ComponentsPanel } from './ComponentsPanel'
import { useCanvasStore } from '../store/canvasStore'

export function AppLayout() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { width, height } = useViewportSize(canvasRef)
  const [dialog, setDialog] = useState<'new' | 'open' | null>(null)
  const shapesPanelOpen = useCanvasStore((s) => s.shapesPanelOpen)
  const selectedIds = useCanvasStore((s) => s.selectedIds)
  const toolboxOpen = useCanvasStore((s) => s.toolboxOpen)

  useKeyboardShortcuts()

  return (
    <div className="flex h-full w-full flex-col bg-surface">
      {/* Toolbar superior compacta */}
      <Toolbar
        onNewProject={() => setDialog('new')}
        onOpenProjects={() => setDialog('open')}
      />

      {/* FloatingToolbar com Undo/Redo */}
      <FloatingToolbar />

      {/* Canvas com máxima área útil */}
      <div className="relative flex-1 min-h-0 overflow-hidden bg-white">
        <div ref={canvasRef} className="w-full h-full">
          <InfiniteCanvas width={width} height={height} />
        </div>

        {/* Grid info badge */}
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-slate-300 bg-white/90 px-3 py-1.5 font-mono text-xs text-slate-600 shadow-sm">
          mm · grid 10/100
        </div>

        {/* Toolbox flutuante (recolhível) */}
        <ToolboxMenu />

        <button
          type="button"
          aria-label="Mover o canvas para cima"
          title="Mover para cima"
          onClick={() => useCanvasStore.getState().panByScreen(0, -160)}
          className="fixed right-4 top-32 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-surface-border bg-surface-elevated text-2xl text-text shadow-lg transition-all active:scale-95"
        >
          ↑
        </button>

        <button
          type="button"
          aria-label="Mover o canvas para baixo"
          title="Mover para baixo"
          onClick={() => useCanvasStore.getState().panByScreen(0, 160)}
          className={`fixed right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-surface-border bg-surface-elevated text-2xl text-text shadow-lg transition-all active:scale-95 ${
            toolboxOpen ? 'bottom-28' : 'bottom-4'
          }`}
        >
          ↓
        </button>

        {/* Painel de formas (EdgeFinish) flutuante */}
        {shapesPanelOpen && <EdgeFinishPanel />}

        {/* Painel de componentes técnicos */}
        {useCanvasStore((s) => s.componentPanelOpen) && (
          // Lazy load panel
          <ComponentsPanel />
        )}

        {/* Painel de propriedades flutuante */}
        {selectedIds.length > 0 && <FloatingProperties />}
      </div>

      {/* Dialogs */}
      <ProjectDialog
        key={dialog ?? 'closed'}
        open={dialog !== null}
        mode={dialog ?? 'new'}
        onClose={() => setDialog(null)}
      />
    </div>
  )
}
