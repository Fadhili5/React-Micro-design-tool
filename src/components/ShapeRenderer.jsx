import React from 'react'

function trianglePoints(x, y, w, h) {
  return `${x + w / 2},${y} ${x + w},${y + h} ${x},${y + h}`
}

export default function ShapeRenderer({ shape, isSelected, onMouseDown }) {
  const { id, type, x, y, width, height, fill, stroke, strokeWidth, opacity, rotation, text, fontSize } = shape
  const cx = x + width / 2
  const cy = y + height / 2
  const transform = `rotate(${rotation || 0}, ${cx}, ${cy})`

  const sharedProps = {
    fill,
    stroke: stroke === 'none' ? 'none' : stroke,
    strokeWidth,
    opacity,
    style: { cursor: 'move' },
    onMouseDown: (e) => onMouseDown(e, id),
  }

  return (
    <g transform={transform}>
      {type === 'rect' && (
        <rect x={x} y={y} width={width} height={height} rx={2} {...sharedProps} />
      )}
      {type === 'circle' && (
        <ellipse cx={cx} cy={cy} rx={width / 2} ry={height / 2} {...sharedProps} />
      )}
      {type === 'triangle' && (
        <polygon points={trianglePoints(x, y, width, height)} {...sharedProps} />
      )}
      {type === 'text' && (
        <>
          {/* invisible hit rect so the whole bounding box is draggable */}
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
            style={{ userSelect: 'none', cursor: 'move' }}
            onMouseDown={(e) => onMouseDown(e, id)}
          >
            {text}
          </text>
        </>
      )}
    </g>
  )
}
