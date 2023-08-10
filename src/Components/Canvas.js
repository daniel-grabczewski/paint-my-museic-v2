import { useOnDraw } from './Hooks'
import { useState, useRef } from 'react'
import { colors } from '../data'

const Canvas = ({ width, height }) => {
  const [color, setColor] = useState(colors[3]); // The initial color is black
  const audioRef = useRef(new Audio(color.music));

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
