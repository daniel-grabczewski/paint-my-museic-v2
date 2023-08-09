import { useRef } from "react";

export function useOnDraw(onDraw) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const prevPointRef = useRef(null);

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
    window.addEventListener("mousemove", mouseMoveListener);
  }

  initMouseMoveListener();

  return {
    onCanvasMouseDown
  }
}

