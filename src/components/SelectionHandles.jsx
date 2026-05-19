import React from 'react'

const H = 8           // handle square size
const ROT = 30        // rotation handle offset above top edge
const BLUE = '#0099ff'

const CURSORS = {
  nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize',
  e:  'e-resize',  se: 'se-resize',
  s:  's-resize',  sw: 'sw-resize', w: 'w-resize',
}

// Fractional positions (dx,dy) within the bounding box for each handle.
const HANDLES = [
  { id: 'nw', dx: 0,   dy: 0   },
  { id: 'n',  dx: 0.5, dy: 0   },
  { id: 'ne', dx: 1,   dy: 0   },
  { id: 'e',  dx: 1,   dy: 0.5 },
  { id: 'se', dx: 1,   dy: 1   },
  { id: 's',  dx: 0.5, dy: 1   },
  { id: 'sw', dx: 0,   dy: 1   },
  { id: 'w',  dx: 0,   dy: 0.5 },
]

// Renders the dashed selection outline, 8 resize handles, and rotation stem+circle.
// Architecture: group has pointerEvents:none; interactive children override to 'all'.
export default function SelectionHandles({ shape, onResizeStart, onRotateStart }) {
  const { x, y, width, height, rotation } = shape
  const cx = x + width / 2
  const cy = y + height / 2

  return (
    <g
      transform={`rotate(${rotation || 0}, ${cx}, ${cy})`}
      style={{ pointerEvents: 'none' }}
    >
      {/* dashed bounding-box outline */}
      <rect
        x={x} y={y} width={width} height={height}
        fill="none" stroke={BLUE} strokeWidth={1.5} strokeDasharray="5 3"
        style={{ pointerEvents: 'none' }}
      />

      {/* rotation stem */}
      <line
        x1={cx} y1={y} x2={cx} y2={y - ROT}
        stroke={BLUE} strokeWidth={1.5}
        style={{ pointerEvents: 'none' }}
      />

      {/* rotation handle — circular, 30 px above top edge */}
      <circle
        cx={cx} cy={y - ROT} r={6}
        fill="white" stroke={BLUE} strokeWidth={1.5}
        style={{ cursor: 'crosshair', pointerEvents: 'all' }}
        onMouseDown={(e) => { e.stopPropagation(); onRotateStart(e) }}
      />

      {/* 8 resize handles */}
      {HANDLES.map(({ id, dx, dy }) => (
        <rect
          key={id}
          x={x + dx * width  - H / 2}
          y={y + dy * height - H / 2}
          width={H} height={H}
          fill="white" stroke={BLUE} strokeWidth={1.5}
          style={{ cursor: CURSORS[id], pointerEvents: 'all' }}
          onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, id) }}
        />
      ))}
    </g>
  )
}
