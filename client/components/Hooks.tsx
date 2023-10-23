import { useEffect, useRef } from 'react'
import { OnDrawFunc, PointType } from '../models'

export function useOnDraw(
  onDraw: OnDrawFunc,
  audioRef: React.MutableRefObject<HTMLAudioElement>,
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
      const point = computePointInCanvas(e.clientX, e.clientY);
      if (point) {
        lastTwoPoints.current.push(point);
  
        if (lastTwoPoints.current.length === 3) {
          const ctx = canvasRef.current.getContext('2d');
          ctxRef.current = ctx;
          if (ctx && onDraw) onDraw(ctx, lastTwoPoints.current[0], lastTwoPoints.current[1], point);
          lastTwoPoints.current.shift();
        }
      }
    }
  };

  const mouseUpListener = () => {
    isDrawingRef.current = false
    lastTwoPoints.current = [];
    audioRef.current.pause()
  };

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
      canvasRef.current = ref;
    },
    onCanvasMouseDown: () => {
      isDrawingRef.current = true;
      audioRef.current.play();
    }
  }
}
