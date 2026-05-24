import type { Camera, ScreenPoint, ViewportSize, WorldPoint } from '../types/camera'
import { DEFAULT_SCALE } from './constants'

export function createDefaultCamera(): Camera {
  return { x: 0, y: 0, scale: DEFAULT_SCALE }
}

export function worldToScreen(
  world: WorldPoint,
  camera: Camera,
  viewport: ViewportSize,
): ScreenPoint {
  const dx = (world.x - camera.x) * camera.scale
  const dy = (world.y - camera.y) * camera.scale
  return {
    x: viewport.width / 2 + dx,
    y: viewport.height / 2 + dy,
  }
}

export function screenToWorld(
  screen: ScreenPoint,
  camera: Camera,
  viewport: ViewportSize,
): WorldPoint {
  const dx = screen.x - viewport.width / 2
  const dy = screen.y - viewport.height / 2
  return {
    x: camera.x + dx / camera.scale,
    y: camera.y + dy / camera.scale,
  }
}

export function getVisibleWorldBounds(
  camera: Camera,
  viewport: ViewportSize,
): { minX: number; minY: number; maxX: number; maxY: number } {
  const halfW = viewport.width / 2 / camera.scale
  const halfH = viewport.height / 2 / camera.scale
  return {
    minX: camera.x - halfW,
    minY: camera.y - halfH,
    maxX: camera.x + halfW,
    maxY: camera.y + halfH,
  }
}

export function clampScale(scale: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, scale))
}
