import { useOnDraw } from './Hooks'
import { useState, useRef, useEffect } from 'react'
import { colors } from '../data'
import { CanvasProps, ColorType, PointType } from '../models'

const Canvas = ({ width, height }: CanvasProps) => {
  const [color, setColor] = useState(colors[3] as ColorType)
  const [brushThickness, setBrushThickness] = useState(5)
  const [hoveredThickness, setHoveredThickness] = useState<number | null>(null)

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
          alignItems: 'center',
          height: '775px',
          boxSizing: 'border-box',
        }}
      >
        {/* Color and Eraser Selection */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'white',
            padding: '28px',
            borderRadius: '30px',
            marginBottom: '22px',
            gap: '14px',
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
              height: '45px',
              width: '45px',
              borderRadius: '7px',
              border:
                color.color === 'eraser'
                  ? '4px solid #686868'
                  : '4px solid white',
            }}
          >
            <img src="/images/eraser.svg" alt="" />
          </div>
          <button onClick={clearCanvas} style = {{color : 'white', background : '#686868', border : 'none', borderRadius : '10px', padding : '5px', fontSize : '15px', cursor : 'pointer'}}
          >clear</button>
        </div>

        {/* Thickness Selection */}
        <div
          style={{
            background: 'white',
            padding: '24px 28px',
            borderRadius: '30px',
            boxSizing: 'border-box',
          }}
        >
          {[2, 5, 10].map((thickness, index) => (
            <div
              key={thickness}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginBottom: index !== 2 ? '5px' : '0px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.3s',
              }}
              onClick={() => setBrushThickness(thickness)}
              onMouseEnter={() => setHoveredThickness(thickness)}
              onMouseLeave={() => setHoveredThickness(null)}
            >
              {brushThickness === thickness ? (
                <div
                  style={{
                    position: 'absolute',
                    right: 'calc(80% + 15px)', // Adjust this value
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 0,
                    height: 0,
                    borderTop: '7px solid transparent',
                    borderBottom: '7px solid transparent',
                    borderLeft: '8px solid #686868',
                  }}
                ></div>
              ) : null}

              <div
                style={{
                  background:
                    hoveredThickness === thickness ? '#686868' : 'black',
                  height: `${thickness + 3}px`,
                  width: '58px',
                  transition: 'background 0.3s',
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Canvas

const canvasStyle = {
  backgroundColor: 'white',
  borderRadius: '35px',
  boxShadow: '0px 15px 45px rgba(0, 0, 0, 0.5)',
}
