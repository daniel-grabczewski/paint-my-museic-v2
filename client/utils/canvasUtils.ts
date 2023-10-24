import { PointType } from '../models'

export function drawLine(
  p0: PointType | null,
  p1: PointType,
  p2: PointType,
  p3: PointType | null,
  ctx: CanvasRenderingContext2D,
  color: string,
  width: number
) {
  if (!p0 || !p3) return

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = width
  ctx.strokeStyle = color

  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)
  ctx.stroke()
}

export const eraser = {
  color: 'eraser',
  code: 'white',
  music: '/music/white.mp3',
  isPicked: false,
  image: '/images/eraser.jpg',
}

export function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
  if (e.key === 'Enter' || e.key === 'Space') {
    e.preventDefault()
  }
}
