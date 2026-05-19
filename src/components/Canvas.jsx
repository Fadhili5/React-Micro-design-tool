import React from 'react'
import ShapeRenderer from './ShapeRenderer'

// Phase 3: renders shapes on an SVG canvas — no interactivity yet.
export default function Canvas({ shapes, onMouseDown }) {
  return (
    <svg
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      <rect width="100%" height="100%" fill="#16213e" />
      {shapes.map(shape => (
        <ShapeRenderer
          key={shape.id}
          shape={shape}
          onMouseDown={onMouseDown ?? (() => {})}
        />
      ))}
    </svg>
  )
}
