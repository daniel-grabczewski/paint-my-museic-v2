import { useEffect, useRef } from 'react'
import { OnDrawFunc, PointType } from '../models'

export function useOnDraw(
  onDraw: (
    ctx: CanvasRenderingContext2D,
    point1: PointType,
    point2: PointType,
    point3: PointType,
    point4: PointType
  ) => void,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  ctxRef: React.MutableRefObject<CanvasRenderingContext2D | null>
) {
  const canvasRef = useRef(null as HTMLCanvasElement | null)
  const isDrawingRef = useRef(false as boolean)
  const lastTwoPoints = useRef([] as PointType[])

  function computePointInCanvas(clientX: number, clientY: number) {
    if (canvasRef.current) {
      const boundingRect = canvasRef.current.getBoundingClientRect()
      return {
        x: clientX - boundingRect.left,
        y: clientY - boundingRect.top,
      }
    } else {
      return null
    }
  }

  const mouseMoveListener = (e: MouseEvent) => {
    if (isDrawingRef.current && canvasRef.current) {
      const point = computePointInCanvas(e.clientX, e.clientY)
      if (point) {
        lastTwoPoints.current.push(point)

        if (lastTwoPoints.current.length === 4) {
          const ctx = canvasRef.current.getContext('2d')
          ctxRef.current = ctx
          if (ctx && onDraw)
            onDraw(
              ctx,
              lastTwoPoints.current[0],
              lastTwoPoints.current[1],
              lastTwoPoints.current[2],
              lastTwoPoints.current[3]
            )
          lastTwoPoints.current.shift()
        }
      }
    }
  }

  const mouseUpListener = () => {
    isDrawingRef.current = false
    lastTwoPoints.current = []
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  useEffect(() => {
    function initMouseMoveListener() {
      window.addEventListener('mousemove', mouseMoveListener)
    }

    function initMouseUpListener() {
      window.addEventListener('mouseup', mouseUpListener)
    }

    function cleanup() {
      window.removeEventListener('mousemove', mouseMoveListener)
      window.removeEventListener('mouseup', mouseUpListener)
    }

    initMouseMoveListener()
    initMouseUpListener()
    return () => cleanup()
  }, [onDraw, audioRef, ctxRef])

  return {
    setCanvasRef: (ref: HTMLCanvasElement | null) => {
      canvasRef.current = ref
    },
    onCanvasMouseDown: () => {
      isDrawingRef.current = true
      if (audioRef.current) {
        audioRef.current
          .play()
          .catch((error) => console.error('Audio play failed', error))
      }
    },
  }
}
