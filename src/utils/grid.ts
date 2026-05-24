import { GRID_MAJOR_MM, GRID_MINOR_MM } from './constants'

export function snapToGrid(valueMm: number, gridMm = GRID_MINOR_MM): number {
  return Math.round(valueMm / gridMm) * gridMm
}

export function snapPoint(
  x: number,
  y: number,
  gridMm = GRID_MINOR_MM,
): { x: number; y: number } {
  return {
    x: snapToGrid(x, gridMm),
    y: snapToGrid(y, gridMm),
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
  return value % GRID_MAJOR_MM === 0
}

export { GRID_MINOR_MM, GRID_MAJOR_MM }
