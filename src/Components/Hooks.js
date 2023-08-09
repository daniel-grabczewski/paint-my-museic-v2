import { useRef } from "react";

export function useOnDraw() {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const prevPointRef = useRef(null);

  function onCanvasMouseDown() {
    isDrawingRef.current = true;
    // More features to be added soon
  }

  return {
    onCanvasMouseDown
  }
}

