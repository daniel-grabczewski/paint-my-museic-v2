import { useEffect, useRef } from 'react'

export function useOnDraw(onDraw, audioRef, ctxRef) {
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const prevPointRef = useRef(null)

  const mouseMoveListenerRef = useRef(null)
  const mouseUpListenerRef = useRef(null)

  function setCanvasRef(ref) {
    canvasRef.current = ref
  }

  function onCanvasMouseDown() {
    isDrawingRef.current = true
    audioRef.current.play()
  }

  useEffect(() => {
    function computePointInCanvas(clientX, clientY) {
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
      const mouseMoveListener = (e) => {
        if (isDrawingRef.current && canvasRef.current) {
          const point = computePointInCanvas(e.clientX, e.clientY)
          const ctx = canvasRef.current.getContext('2d')
          ctxRef.current = ctx
          if (onDraw) onDraw(ctx, point, prevPointRef.current)
          prevPointRef.current = point
          console.log(point)
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
        audioRef.current.currentTime = 0
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
  }, [onDraw])

  return {
    setCanvasRef,
    onCanvasMouseDown,
  }
}
