import { useRef } from 'react'

export function useOnDraw() {
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const prevPointRef = useRef(null)
}
