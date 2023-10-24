import React from 'react'
import { handleKeyDown } from '../utils/canvasUtils'

interface BrushThicknessPanelProps {
  brushThickness: number
  setBrushThickness: (thickness: number) => void
  hoveredThickness: number | null
  setHoveredThickness: (thickness: number | null) => void
}

const BrushThicknessPanel: React.FC<BrushThicknessPanelProps> = ({
  brushThickness,
  setBrushThickness,
  hoveredThickness,
  setHoveredThickness,
}) => {
  return (
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
          {brushThickness === thickness ? <div className="arrow"></div> : null}
          <div
            className="thickness-bar"
            style={{
              height: `${thickness + 3}px`,
              background: hoveredThickness === thickness ? '#686868' : 'black',
            }}
          ></div>
        </div>
      ))}
    </div>
  )
}

export default BrushThicknessPanel
