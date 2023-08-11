import { useEffect, useRef } from 'react'
import { OnDrawFunc, PointType } from '../models'



export function useOnDraw(
  onDraw: OnDrawFunc,
  audioRef: React.MutableRefObject<HTMLAudioElement>,
  ctxRef: React.MutableRefObject<CanvasRenderingContext2D | null>
) {
  const canvasRef = useRef(null as HTMLCanvasElement | null)
  const isDrawingRef = useRef(false as boolean)
  const prevPointRef = useRef(null as PointType | null)

  const mouseMoveListenerRef = useRef(null as ((e: MouseEvent) => void) | null)
  const mouseUpListenerRef = useRef(null as (() => void) | null)

  function setCanvasRef(ref: HTMLCanvasElement | null) {
    canvasRef.current = ref
  }

  function onCanvasMouseDown() {
    isDrawingRef.current = true
    audioRef.current.play()
  }

  useEffect(() => {
    function computePointInCanvas(clientX : number, clientY : number) {
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

    function initMouseMoveListener() {
      const mouseMoveListener = (e: MouseEvent) => {
        if (isDrawingRef.current && canvasRef.current) {
          const point = computePointInCanvas(e.clientX, e.clientY)
          const ctx = canvasRef.current.getContext('2d')
          ctxRef.current = ctx
          if (ctx && point && onDraw) onDraw(ctx, point, prevPointRef.current)
          prevPointRef.current = point
        }
      }
      mouseMoveListenerRef.current = mouseMoveListener
      window.addEventListener('mousemove', mouseMoveListener)
    }
    

    function initMouseUpListener() {
      const listener = () => {
        isDrawingRef.current = false
        prevPointRef.current = null
        audioRef.current.pause()
      }
      mouseUpListenerRef.current = listener
      window.addEventListener('mouseup', listener)
    }

    function cleanup() {
      if (mouseMoveListenerRef.current) {
        window.removeEventListener('mousemove', mouseMoveListenerRef.current)
      }
      if (mouseUpListenerRef.current) {
        window.removeEventListener('mouseup', mouseUpListenerRef.current)
      }
    }

    initMouseMoveListener()
    initMouseUpListener()
    return () => cleanup()
  }, [onDraw, audioRef, ctxRef])

  return {
    setCanvasRef,
    onCanvasMouseDown,
  }
}
