import { useOnDraw } from './Hooks'
import { useState, useRef, useEffect } from 'react'
import { colors } from '../data'

const Canvas = ({ width, height }) => {
  const [color, setColor] = useState(colors[3]); 
  const audioRef = useRef(new Audio(color.music));

  useEffect(() => {
    audioRef.current.src = color.music;
  }, [color]);

  const { onCanvasMouseDown } = useOnDraw();

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
