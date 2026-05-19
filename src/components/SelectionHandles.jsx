import React from 'react'

const H = 8
const ROTATE_OFFSET = 30
const SEL = '#0099ff'

const CURSORS = {
  nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize',
  e: 'e-resize', se: 'se-resize', s: 's-resize',
  sw: 'sw-resize', w: 'w-resize',
}

export default function SelectionHandles({ shape, onResizeStart, onRotateStart }) {
  const { x, y, width, height, rotation } = shape
  const cx = x + width / 2
  const cy = y + height / 2

  const handles = [
    { id: 'nw', hx: x,          hy: y },
    { id: 'n',  hx: cx,         hy: y },
    { id: 'ne', hx: x + width,  hy: y },
    { id: 'e',  hx: x + width,  hy: cy },
    { id: 'se', hx: x + width,  hy: y + height },
    { id: 's',  hx: cx,         hy: y + height },
    { id: 'sw', hx: x,          hy: y + height },
    { id: 'w',  hx: x,          hy: cy },
  ]

  return (
    <g transform={`rotate(${rotation || 0}, ${cx}, ${cy})`}>
      {/* dashed bounding box */}
      <rect
        x={x} y={y} width={width} height={height}
        fill="none" stroke={SEL} strokeWidth={1.5} strokeDasharray="4 2"
        style={{ pointerEvents: 'none' }}
      />

      {/* rotation stem */}
      <line
        x1={cx} y1={y} x2={cx} y2={y - ROTATE_OFFSET}
        stroke={SEL} strokeWidth={1.5}
        style={{ pointerEvents: 'none' }}
      />

      {/* rotation handle */}
      <circle
        cx={cx} cy={y - ROTATE_OFFSET} r={6}
        fill="white" stroke={SEL} strokeWidth={1.5}
        style={{ cursor: 'crosshair', pointerEvents: 'all' }}
        onMouseDown={(e) => { e.stopPropagation(); onRotateStart(e) }}
      />

      {/* resize handles */}
      {handles.map(({ id, hx, hy }) => (
        <rect
          key={id}
          x={hx - H / 2} y={hy - H / 2}
          width={H} height={H}
          fill="white" stroke={SEL} strokeWidth={1.5}
          style={{ cursor: CURSORS[id], pointerEvents: 'all' }}
          onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, id) }}
        />
      ))}
    </g>
  )
}
