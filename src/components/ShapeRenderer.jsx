import React from 'react'

function trianglePoints(x, y, w, h) {
  return `${x + w / 2},${y} ${x + w},${y + h} ${x},${y + h}`
}

export default function ShapeRenderer({ shape, onMouseDown, isHovered, onHover, onUnhover }) {
  const {
    id, type, x, y, width, height,
    fill, stroke, strokeWidth, opacity, rotation,
    text, fontSize,
  } = shape

  const cx = x + width  / 2
  const cy = y + height / 2

  const shared = {
    fill,
    stroke: stroke === 'none' ? 'none' : stroke,
    strokeWidth,
    opacity,
    style: { cursor: 'move' },
    onMouseDown:  (e) => onMouseDown(e, id),
    onTouchStart: (e) => onMouseDown(e, id),
    onMouseEnter: onHover,
    onMouseLeave: onUnhover,
  }

  return (
    <g
      transform={`rotate(${rotation || 0}, ${cx}, ${cy})`}
      className="shape-new"
      style={isHovered ? { filter: 'drop-shadow(0 0 8px rgba(0,153,255,0.65))' } : undefined}
    >
      {type === 'rect' && (
        <rect x={x} y={y} width={width} height={height} rx={2} {...shared} />
      )}

      {type === 'circle' && (
        <ellipse cx={cx} cy={cy} rx={width / 2} ry={height / 2} {...shared} />
      )}

      {type === 'triangle' && (
        <polygon points={trianglePoints(x, y, width, height)} {...shared} />
      )}

      {type === 'text' && (
        <>
          {/* SVG text has no pointer-event fill area; transparent rect provides the hit target. */}
          <rect
            x={x} y={y} width={width} height={height}
            fill="transparent" stroke="none"
            style={{ cursor: 'move' }}
            onMouseDown={(e) => onMouseDown(e, id)}
            onTouchStart={(e) => onMouseDown(e, id)}
            onMouseEnter={onHover}
            onMouseLeave={onUnhover}
          />
          <text
            x={cx}
            y={cy + (fontSize || 16) * 0.35}
            textAnchor="middle"
            fill={fill}
            fontSize={fontSize || 16}
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          >
            {text}
          </text>
        </>
      )}
    </g>
  )
}
