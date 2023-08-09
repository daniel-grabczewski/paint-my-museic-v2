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
    // Continue expanding this function in subsequent commits
  }

  function initMouseMoveListener() {
    const mouseMoveListener = (e) => {
      if (isDrawingRef.current && canvasRef.current) {
        const point = computePointInCanvas(e.clientX, e.clientY);
        // Drawing logic will be added later
      }
    };
    window.addEventListener("mousemove", mouseMoveListener);
  }

  initMouseMoveListener();

  return {
    onCanvasMouseDown
  }
}

