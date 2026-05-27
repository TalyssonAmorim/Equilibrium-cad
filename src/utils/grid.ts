import { GRID_MAJOR_CM, GRID_MINOR_CM } from './constants'

export function snapToGrid(valueCm: number, gridCm = GRID_MINOR_CM): number {
  return Math.round(valueCm / gridCm) * gridCm
}

export function snapPoint(
  x: number,
  y: number,
  gridCm = GRID_MINOR_CM,
): { x: number; y: number } {
  return {
    x: snapToGrid(x, gridCm),
    y: snapToGrid(y, gridCm),
  }
}

export function getGridLineRange(
  min: number,
  max: number,
  step: number,
): number[] {
  const start = Math.floor(min / step) * step
  const lines: number[] = []
  for (let v = start; v <= max; v += step) {
    lines.push(v)
  }
  return lines
}

export function isMajorGridLine(value: number): boolean {
  return value % GRID_MAJOR_CM === 0
}

export { GRID_MINOR_CM, GRID_MAJOR_CM }
