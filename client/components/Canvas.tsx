import { useOnDraw } from './Hooks'
import { useState, useRef, useEffect } from 'react'
import { colors, clearSound } from '../data'
import { CanvasProps, ColorType, PointType } from '../models'
import { drawLine } from '../utils/canvasUtils'
import ColorPanel from './ColorPanel'
import BrushThicknessPanel from './BrushThicknessPanel'

const Canvas = ({ width, height }: CanvasProps) => {
  const [color, setColor] = useState(colors[3] as ColorType)
  const [brushThickness, setBrushThickness] = useState(5)
  const [hoveredThickness, setHoveredThickness] = useState<number | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(color.music)
    audio.load()
    audioRef.current = audio
  }, [color.music])

  const clearSoundRef = useRef(new Audio(`${clearSound}`) as HTMLAudioElement)
  const ctxRef = useRef(null as CanvasRenderingContext2D | null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = color.music
    }
  }, [color])

  const { setCanvasRef, onCanvasInteraction } = useOnDraw(
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

  function clearCanvas() {
    if (ctxRef.current) {
      ctxRef.current.clearRect(0, 0, width, height)
      clearSoundRef.current.play()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }

  return (
    <div className="container">
      <div className="canvas-container">
        <canvas
          width={width}
          height={height}
          onMouseDown={onCanvasInteraction}
          onTouchStart={onCanvasInteraction}
          className="canvas-style"
          ref={setCanvasRef}
        />
      </div>
      <div className="tools-wrapper">
        <ColorPanel
          colors={colors}
          color={color}
          setColor={setColor}
          audioRef={audioRef}
          clearCanvas={clearCanvas}
        />
        <BrushThicknessPanel
          brushThickness={brushThickness}
          setBrushThickness={setBrushThickness}
          hoveredThickness={hoveredThickness}
          setHoveredThickness={setHoveredThickness}
        />
      </div>
    </div>
  )
}

export default Canvas
