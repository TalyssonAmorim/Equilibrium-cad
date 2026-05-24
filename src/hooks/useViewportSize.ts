import { useEffect, useState } from 'react'
import { useCanvasStore } from '../store/canvasStore'
import {
  PROPERTIES_WIDTH,
  SIDEBAR_WIDTH,
  TOOLBAR_HEIGHT,
} from '../utils/constants'

export function useViewportSize(containerRef: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const setViewport = useCanvasStore((s) => s.setViewport)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      const width = Math.max(0, rect.width)
      const height = Math.max(0, rect.height)
      setSize({ width, height })
      setViewport({ width, height })
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('orientationchange', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('orientationchange', update)
    }
  }, [containerRef, setViewport])

  return size
}

export function getCanvasAreaSize(windowW: number, windowH: number) {
  return {
    width: windowW - SIDEBAR_WIDTH - PROPERTIES_WIDTH,
    height: windowH - TOOLBAR_HEIGHT,
  }
}
