export interface Camera {
  /** Centro da viewport em coordenadas mundo (cm) */
  x: number
  y: number
  /** Escala: pixels por centímetro */
  scale: number
}

export interface ViewportSize {
  width: number
  height: number
}

export interface WorldPoint {
  x: number
  y: number
}

export interface ScreenPoint {
  x: number
  y: number
}
