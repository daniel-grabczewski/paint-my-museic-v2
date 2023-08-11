import { useOnDraw } from './Hooks'
import { useState, useRef, useEffect } from 'react'
import { colors } from '../data'

const Canvas = ({ width, height }) => {
  const [color, setColor] = useState(colors[3])

  const audioRef = useRef(new Audio(color.music))

  const clearSoundRef = useRef(new Audio('/music/clear.mp3'))

  const ctxRef = useRef(null)

  useEffect(() => {
    audioRef.current.src = color.music
  }, [color])

  const { setCanvasRef, onCanvasMouseDown } = useOnDraw(
    onDraw,
    audioRef,
    ctxRef
  )

  function onDraw(ctx, point, prevPoint) {
    ctxRef.current = ctx
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

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI)
    ctx.fill()
  }

  function clearCanvas() {
    if (ctxRef.current) {
      ctxRef.current.clearRect(0, 0, width, height)
      clearSoundRef.current.play()
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <>
      <canvas
        width={width}
        height={height}
        onMouseDown={onCanvasMouseDown}
        style={canvasStyle}
        ref={setCanvasRef}
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
              border:
                c.color === color.color
                  ? c.color === 'black'
                    ? '3px solid grey'
                    : '3px solid black'
                  : 'none',
              boxSizing: 'border-box',
            }}
            onClick={() => {
              setColor(c)
              audioRef.current.pause()
              audioRef.current.currentTime = 0
            }}
          ></div>
        ))}
        <button onClick={clearCanvas}>Clear</button>
      </div>
    </>
  )
}

export default Canvas

const canvasStyle = {
  border: '1px solid black',
}
