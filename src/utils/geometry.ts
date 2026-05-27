import type { WorldPoint } from '../types/camera'

export function distanceCm(a: WorldPoint, b: WorldPoint): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.hypot(dx, dy)
}

export function formatCm(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)} cm`
}

export function generateId(): string {
  return crypto.randomUUID()
}
