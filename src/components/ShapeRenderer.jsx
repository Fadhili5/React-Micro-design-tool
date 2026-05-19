import React from 'react'

function trianglePoints(x, y, w, h) {
  // top-center, bottom-right, bottom-left
  return `${x + w / 2},${y} ${x + w},${y + h} ${x},${y + h}`
}

// Pure render component (architecture.md).
// Wraps every shape in <g transform="rotate(θ,cx,cy)"> for rotation.
// Text always renders an invisible hit-rect over the bounding box (agents.md fix:
// the rect must be present even when not selected, not only when selected).
export default function ShapeRenderer({ shape, onMouseDown }) {
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
    onMouseDown: (e) => onMouseDown(e, id),
  }

  return (
    <g transform={`rotate(${rotation || 0}, ${cx}, ${cy})`}>
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
          {/* Invisible rect — always present (agents.md fix) so the whole bbox is draggable */}
          <rect
            x={x} y={y} width={width} height={height}
            fill="transparent" stroke="none"
            style={{ cursor: 'move' }}
            onMouseDown={(e) => onMouseDown(e, id)}
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
