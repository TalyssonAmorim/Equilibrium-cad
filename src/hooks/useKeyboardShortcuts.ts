import { useEffect } from 'react'
import { useCanvasStore } from '../store/canvasStore'
import { TOOLS } from '../types/tools'
import { useProjectStore } from '../store/projectStore'

export function useKeyboardShortcuts() {
  const setActiveTool = useCanvasStore((s) => s.setActiveTool)
  const undo = useProjectStore((s) => s.undo)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        undo()
        return
      }
      const key = e.key.toUpperCase()
      const tool = TOOLS.find((t) => t.shortcut === key)
      if (tool) {
        e.preventDefault()
        setActiveTool(tool.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setActiveTool, undo])
}
