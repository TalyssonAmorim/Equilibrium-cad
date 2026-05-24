import { useEffect } from 'react'
import { AppLayout } from './components/AppLayout'
import { useProjectStore } from './store/projectStore'

function App() {
  const refreshProjectList = useProjectStore((s) => s.refreshProjectList)
  const project = useProjectStore((s) => s.project)

  useEffect(() => {
    void refreshProjectList()
  }, [refreshProjectList])

  return (
    <>
      <AppLayout />
      {!project && <WelcomeOverlay />}
    </>
  )
}

function WelcomeOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-center pb-24">
      <p className="rounded-xl bg-surface-elevated/95 px-6 py-3 text-center text-sm text-text-muted shadow-lg">
        Toque em <strong className="text-accent">Novo</strong> para iniciar um
        croqui técnico
      </p>
    </div>
  )
}

export default App
