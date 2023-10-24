import React from 'react'
import { ColorType } from '../models'
import { eraser, handleKeyDown } from '../utils/canvasUtils'

interface ColorPanelProps {
  colors: ColorType[]
  color: ColorType
  setColor: (color: ColorType) => void
  audioRef: React.RefObject<HTMLAudioElement>
  clearCanvas: () => void
}

const ColorPanel: React.FC<ColorPanelProps> = ({
  colors,
  color,
  setColor,
  audioRef,
  clearCanvas,
}) => {
  return (
    <div className="color-selection">
      {colors.map((c) => (
        <div
          key={c.color}
          className={`color-option ${
            c.color === color.color ? 'selected' : ''
          }`}
          onClick={() => {
            setColor(c)
            if (audioRef.current) {
              audioRef.current.pause()
              audioRef.current.currentTime = 0
            }
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
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
          }
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
  )
}

export default ColorPanel
