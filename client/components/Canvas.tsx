import { useOnDraw } from './Hooks'
import { useState, useRef, useEffect } from 'react'
import { colors } from '../data'
import { CanvasProps, ColorType, PointType } from '../models'

const Canvas = ({ width, height }: CanvasProps) => {
  const [color, setColor] = useState(colors[3] as ColorType)
  const [brushThickness, setBrushThickness] = useState(5); // Added brush thickness state

  const eraser = {
    color: 'eraser',
    code: 'white',
    music: '/music/white.mp3',
    isPicked: false,
    image: '/images/eraser.jpg',
  }
  
  const audioRef = useRef(new Audio(color.music) as HTMLAudioElement)

  const clearSoundRef = useRef(
    new Audio('/music/clear.mp3') as HTMLAudioElement
  )

  const ctxRef = useRef(null as CanvasRenderingContext2D | null)

  useEffect(() => {
    audioRef.current.src = color.music
  }, [color])

  const { setCanvasRef, onCanvasMouseDown } = useOnDraw(
    onDraw,
    audioRef,
    ctxRef
  )

  function onDraw(
    ctx: CanvasRenderingContext2D,
    point1: PointType,
    point2: PointType,
    point3: PointType,
    point4: PointType
  ) {
    ctxRef.current = ctx
    drawLine(point1, point2, point3, point4, ctx, color.code, brushThickness)
  }

  function drawLine(
    p0: PointType | null,
    p1: PointType,
    p2: PointType,
    p3: PointType | null,
    ctx: CanvasRenderingContext2D,
    color: string,
    width: number
  ) {
    if (!p0 || !p3) return

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = width // Updated to use the brush thickness
    ctx.strokeStyle = color

    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)
    ctx.stroke()
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
          background: 'white',
          padding: '10px',
        }}
      >
        {colors.map((c) => (
          <div
            key={c.color}
            style={{
              background: c.code,
              height: '60px',
              width: '60px',
              border: c.color === color.color ? '4px solid #686868' : 'none',
              boxSizing: 'border-box',
              borderRadius: '7px',
            }}
            onClick={() => {
              setColor(c)
              audioRef.current.pause()
              audioRef.current.currentTime = 0
            }}
          ></div>
        ))}
        <div
          onClick={() => {
            setColor(eraser)
            audioRef.current.pause()
            audioRef.current.currentTime = 0
          }}
          style={{
            paddingTop: '1px',
            height: '52px',
            width: '53px',
            borderRadius: '7px',
            border:
              color.color === 'eraser'
                ? '4px solid #686868'
                : '4px solid white',
          }}
        >
          <img src="/images/eraser.svg" alt="" />
        </div>
        <button onClick={clearCanvas}>Clear</button>

        {/* Added brush thickness buttons */}
        <button
          style={{
            backgroundColor: brushThickness === 2 ? '#D0D0D0' : 'white',
            border: '1px solid #686868',
            borderRadius: '7px',
            padding: '5px 10px',
            marginTop: '10px'
          }}
          onClick={() => setBrushThickness(2)}
        >
          Thickness 2
        </button>

        <button
          style={{
            backgroundColor: brushThickness === 5 ? '#D0D0D0' : 'white',
            border: '1px solid #686868',
            borderRadius: '7px',
            padding: '5px 10px',
            marginTop: '10px'
          }}
          onClick={() => setBrushThickness(5)}
        >
          Thickness 5
        </button>

        <button
          style={{
            backgroundColor: brushThickness === 10 ? '#D0D0D0' : 'white',
            border: '1px solid #686868',
            borderRadius: '7px',
            padding: '5px 10px',
            marginTop: '10px'
          }}
          onClick={() => setBrushThickness(10)}
        >
          Thickness 10
        </button>
      </div>
    </>
  )
}

export default Canvas

const canvasStyle = {
  border: '1px solid black',
}
