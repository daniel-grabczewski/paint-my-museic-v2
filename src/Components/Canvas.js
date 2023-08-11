import { useOnDraw } from './Hooks'
import { useState, useRef, useEffect } from 'react'
import { colors } from '../data'

const Canvas = ({ width, height }) => {
  const [color, setColor] = useState(colors[3])
  const audioRef = useRef(new Audio(color.music))
  const ctxRef = useRef(null)

  useEffect(() => {
    audioRef.current.src = color.music
  }, [color])

  const { onCanvasMouseDown } = useOnDraw(onDraw, audioRef, ctxRef)

  function onDraw(ctx, point, prevPoint) {
    drawLine(prevPoint, point, ctx, color.code, 5)
  }

  function drawLine(start, end, ctx, color, width) {
    start = start ?? end
    ctx.beginPath()
    ctx.lineWidth = width
    ctx.strokeStyle = color
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
  }

  function clearCanvas() {
    if (ctxRef.current) {
      ctxRef.current.clearRect(0, 0, width, height)
    }
  }

  return (
    <>
      <canvas
        width={width}
        height={height}
        onMouseDown={onCanvasMouseDown}
        style={{ border: '1px solid black' }}
      />
      <div
        style={{
          marginLeft: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: 'lightGray',
          padding: '10px',
        }}
      >
        {colors.map((c) => (
          <div
            key={c.color}
            style={{
              background: c.code,
              height: '50px',
              width: '50px',
              border: c.color === color.color ? '3px solid black' : 'none',
              boxSizing: 'border-box',
            }}
            onClick={() => setColor(c)}
          ></div>
        ))}
        <button onClick={clearCanvas}>Clear</button>
      </div>
    </>
  )
}

export default Canvas
