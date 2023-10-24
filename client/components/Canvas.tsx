import { useOnDraw } from './Hooks'
import { useState, useRef, useEffect } from 'react'
import { colors } from '../data'
import { CanvasProps, ColorType, PointType } from '../models'
import '../main.css'

const Canvas = ({ width, height }: CanvasProps) => {
  const [color, setColor] = useState(colors[3] as ColorType)
  const [brushThickness, setBrushThickness] = useState(5)
  const [hoveredThickness, setHoveredThickness] = useState<number | null>(null)

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === 'Space') {
      e.preventDefault()
    }
  }
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
    ctx.lineWidth = width
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
        className="canvas-style"
        ref={setCanvasRef}
      />

      <div className="tools-wrapper">
        <div className="color-selection">
          {colors.map((c) => (
            <div
              key={c.color}
              className={`color-option ${
                c.color === color.color ? 'selected' : ''
              }`}
              onClick={() => {
                setColor(c)
                audioRef.current.pause()
                audioRef.current.currentTime = 0
              }}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
              style={{ background: `${c.code}` }}
            ></div>
          ))}
          <div
            className={`eraser-option ${
              color.color === 'eraser' ? 'selected' : ''
            }`}
            onClick={() => {
              setColor(eraser)
              audioRef.current.pause()
              audioRef.current.currentTime = 0
            }}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
          >
            <img src="/images/eraser.svg" alt="Eraser Icon" />
          </div>
          <button className="clear-button" onClick={clearCanvas}>
            clear
          </button>
        </div>

        <div className="thickness-wrapper">
          {[2, 5, 10].map((thickness) => (
            <div
              key={thickness}
              className="thickness-option"
              onClick={() => setBrushThickness(thickness)}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
              onMouseEnter={() => setHoveredThickness(thickness)}
              onMouseLeave={() => setHoveredThickness(null)}
            >
              {brushThickness === thickness ? (
                <div className="arrow"></div>
              ) : null}
              <div
                className="thickness-bar"
                style={{
                  height: `${thickness + 3}px`,
                  background:
                    hoveredThickness === thickness ? '#686868' : 'black',
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
