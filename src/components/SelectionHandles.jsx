import React from 'react'

const H        = 8    // visible handle square size
const TOUCH_R  = 20   // invisible touch target radius (finger-friendly)
const ROT      = 30   // rotation handle offset above top edge
const BLUE     = '#0099ff'

const CURSORS = {
  nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize',
  e:  'e-resize',  se: 'se-resize',
  s:  's-resize',  sw: 'sw-resize', w:  'w-resize',
}

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

// Each interactive element has:
//   - a large transparent hit target (finger-friendly, TOUCH_R radius / TOUCH_R*2 square)
//   - a small visible indicator (pointerEvents:none so it doesn't interfere)
// Both onMouseDown and onTouchStart are wired to the same handler.
export default function SelectionHandles({ shape, onResizeStart, onRotateStart }) {
  const { x, y, width, height, rotation } = shape
  const cx = x + width  / 2
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

      {/* rotation handle — large transparent touch target + small visible circle */}
      <circle
        cx={cx} cy={y - ROT} r={TOUCH_R}
        fill="transparent" stroke="none"
        style={{ cursor: 'crosshair', pointerEvents: 'all' }}
        onMouseDown={(e) => { e.stopPropagation(); onRotateStart(e) }}
        onTouchStart={(e) => { e.stopPropagation(); onRotateStart(e) }}
      />
      <circle
        cx={cx} cy={y - ROT} r={6}
        fill="white" stroke={BLUE} strokeWidth={1.5}
        style={{ pointerEvents: 'none' }}
      />

      {/* 8 resize handles — each has a large touch target + small visible square */}
      {HANDLES.map(({ id, dx, dy }) => {
        const hx = x + dx * width
        const hy = y + dy * height
        return (
          <g key={id}>
            <rect
              x={hx - TOUCH_R} y={hy - TOUCH_R}
              width={TOUCH_R * 2} height={TOUCH_R * 2}
              fill="transparent" stroke="none"
              style={{ cursor: CURSORS[id], pointerEvents: 'all' }}
              onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, id) }}
              onTouchStart={(e) => { e.stopPropagation(); onResizeStart(e, id) }}
            />
            <rect
              x={hx - H / 2} y={hy - H / 2}
              width={H} height={H}
              fill="white" stroke={BLUE} strokeWidth={1.5}
              style={{ pointerEvents: 'none' }}
            />
          </g>
        )
      })}
    </g>
  )
}
