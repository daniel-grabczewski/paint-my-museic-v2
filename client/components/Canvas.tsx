import { useOnDraw } from './Hooks'
import React, { useState, useRef, useEffect } from 'react'
import { colors } from '../data'
import { CanvasProps, ColorType, PointType } from '../models'

const Canvas = ({ width, height }: CanvasProps) => {
  const [color, setColor] = useState(colors[3] as ColorType)

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
    point: PointType,
    prevPoint: PointType | null
  ) {
    ctxRef.current = ctx
    if (prevPoint) {
      drawLine(prevPoint, point, ctx, color.code, 5)
    }
  }

  function drawLine(
    start: PointType | null,
    end: PointType | null,
    ctx: CanvasRenderingContext2D,
    color: string,
    width: number
  ) {
    if (!start || !end) return

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
      </div>
    </>
  )
}
/*
  {
    color: 'eraser',
    code: 'white',
    music: '/music/white.mp3',
    isPicked: false,
    image: '/images/eraser.jpg',
  },
  */

export default Canvas

const canvasStyle = {
  border: '1px solid black',
}
