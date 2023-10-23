export type PointType = {
  x: number
  y: number
}

export type OnDrawFunc = (
  ctx: CanvasRenderingContext2D,
  p1: PointType,
  p2: PointType,
  p3: PointType
) => void

export type ColorType = {
  color: string
  code: string
  music: string
}

export interface CanvasProps {
  width: number
  height: number
}
