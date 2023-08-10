import { useOnDraw } from './Hooks'
import { useState, useRef, useEffect } from 'react'
import { colors } from '../data'

const Canvas = ({ width, height }) => {
  const [color, setColor] = useState(colors[3]);
  const audioRef = useRef(new Audio(color.music));
  const ctxRef = useRef(null);

  useEffect(() => {
    audioRef.current.src = color.music;
  }, [color]);

  const { onCanvasMouseDown } = useOnDraw(
    onDraw,
    audioRef,
    ctxRef
  );

  function onDraw(ctx, point, prevPoint) {
    drawLine(prevPoint, point, ctx, color.code, 5);
  }

  function drawLine(start, end, ctx, color, width) {
    start = start ?? end;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  return (
    <canvas
      width={width}
      height={height}
      onMouseDown={onCanvasMouseDown}
      style={{ border: '1px solid black' }}
    />
  );
}

export default Canvas;
