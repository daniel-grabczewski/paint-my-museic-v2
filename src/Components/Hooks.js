import { useRef, useEffect } from "react";

export function useOnDraw(onDraw, audioRef) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const prevPointRef = useRef(null);
  const mouseMoveListenerRef = useRef(null);
  const mouseUpListenerRef = useRef(null);

  function computePointInCanvas(clientX, clientY) {
    if (canvasRef.current) {
      const boundingRect = canvasRef.current.getBoundingClientRect();
      return {
        x: clientX - boundingRect.left,
        y: clientY - boundingRect.top
      }
    } else {
      return null;
    }
  }

  function onCanvasMouseDown() {
    isDrawingRef.current = true;
    audioRef.current.play();
  }

  function initMouseMoveListener() {
    const mouseMoveListener = (e) => {
      if (isDrawingRef.current && canvasRef.current) {
        const point = computePointInCanvas(e.clientX, e.clientY);
        if (onDraw) {
          const ctx = canvasRef.current.getContext('2d');
          onDraw(ctx, point, prevPointRef.current);
          prevPointRef.current = point;
        }
      }
    };
    mouseMoveListenerRef.current = mouseMoveListener;
    window.addEventListener("mousemove", mouseMoveListener);
  }

  function initMouseUpListener() {
    const mouseUpListener = () => {
      isDrawingRef.current = false;
      prevPointRef.current = null;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    mouseUpListenerRef.current = mouseUpListener;
    window.addEventListener("mouseup", mouseUpListener);
  }

  useEffect(() => {
    function cleanup() {
      if (mouseMoveListenerRef.current) {
        window.removeEventListener("mousemove", mouseMoveListenerRef.current);
      }
      if (mouseUpListenerRef.current) {
        window.removeEventListener("mouseup", mouseUpListenerRef.current);
      }
    }

    return () => cleanup();
  }, []);

  return {
    onCanvasMouseDown
  }
}

