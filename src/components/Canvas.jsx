import React, { useRef, useCallback, useEffect } from 'react'
import ShapeRenderer from './ShapeRenderer'
import SelectionHandles from './SelectionHandles'
import { unrotatePoint } from '../utils/geometry'

// getSVGPoint works for both MouseEvent and TouchEvent.
// TouchEvent uses e.touches[0] (active touch) or e.changedTouches[0] (touchend).
function extractPoint(e, svgRect) {
  const source = e.touches?.[0] ?? e.changedTouches?.[0] ?? e
  return { x: source.clientX - svgRect.left, y: source.clientY - svgRect.top }
}

export default function Canvas({
  shapes, selectedId, selectedShape,
  onSelect, onDeselect, onUpdate,
  tool, onAddShape,
}) {
  const svgRef  = useRef(null)
  const dragRef = useRef(null)

  function getSVGPoint(e) {
    return extractPoint(e, svgRef.current.getBoundingClientRect())
  }

  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current) return
    // Prevent page scroll/zoom while a drag is active on touch.
    if (e.cancelable) e.preventDefault()
    const pt = getSVGPoint(e)
    const d  = dragRef.current

    if (d.type === 'move') {
      onUpdate(d.id, {
        x: d.origX + pt.x - d.startX,
        y: d.origY + pt.y - d.startY,
      })

    } else if (d.type === 'rotate') {
      const angle = Math.atan2(pt.y - d.cy, pt.x - d.cx) * 180 / Math.PI
      onUpdate(d.id, {
        rotation: ((d.origRotation + angle - d.startAngle) % 360 + 360) % 360,
      })

    } else if (d.type === 'resize') {
      const { orig, handle } = d
      const cx = orig.x + orig.width  / 2
      const cy = orig.y + orig.height / 2

      const localPt    = unrotatePoint(pt.x,    pt.y,    cx, cy, orig.rotation || 0)
      const localStart = unrotatePoint(d.startX, d.startY, cx, cy, orig.rotation || 0)
      const dx = localPt.x - localStart.x
      const dy = localPt.y - localStart.y

      const MIN = 20
      let { x, y, width, height } = orig

      if (handle.includes('e')) width  = Math.max(MIN, orig.width  + dx)
      if (handle.includes('s')) height = Math.max(MIN, orig.height + dy)
      if (handle.includes('w')) {
        width = Math.max(MIN, orig.width  - dx)
        x     = orig.x + orig.width  - width
      }
      if (handle.includes('n')) {
        height = Math.max(MIN, orig.height - dy)
        y      = orig.y + orig.height - height
      }

      onUpdate(orig.id, { x, y, width, height })
    }
  }, [onUpdate])

  // Attach both mouse and touch listeners to window so drag survives leaving the SVG.
  useEffect(() => {
    const onMove = (e) => handleMouseMove(e)
    const onUp   = ()  => { dragRef.current = null }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    // passive:false so we can call preventDefault() to block scroll during drag.
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend',  onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend',  onUp)
    }
  }, [handleMouseMove])

  // Shared handler for mouse + touch — same dragRef payload.
  const handleShapeMouseDown = useCallback((e, id) => {
    if (tool !== 'select') return
    e.stopPropagation()
    e.preventDefault()
    onSelect(id)
    const shape = shapes.find(s => s.id === id)
    if (!shape) return
    const pt = getSVGPoint(e)
    dragRef.current = {
      type: 'move', id,
      startX: pt.x, startY: pt.y,
      origX: shape.x, origY: shape.y,
    }
  }, [tool, shapes, onSelect])

  const handleResizeStart = useCallback((e, handleId) => {
    e.preventDefault()
    if (!selectedShape) return
    const pt = getSVGPoint(e)
    dragRef.current = {
      type: 'resize',
      handle: handleId,
      startX: pt.x, startY: pt.y,
      orig: { ...selectedShape },
    }
  }, [selectedShape])

  const handleRotateStart = useCallback((e) => {
    e.preventDefault()
    if (!selectedShape) return
    const pt = getSVGPoint(e)
    const cx = selectedShape.x + selectedShape.width  / 2
    const cy = selectedShape.y + selectedShape.height / 2
    dragRef.current = {
      type: 'rotate',
      id: selectedShape.id,
      cx, cy,
      startAngle: Math.atan2(pt.y - cy, pt.x - cx) * 180 / Math.PI,
      origRotation: selectedShape.rotation || 0,
    }
  }, [selectedShape])

  const handleCanvasMouseDown = useCallback((e) => {
    if (tool === 'select') { onDeselect(); return }
    const pt = getSVGPoint(e)
    onAddShape(tool, pt.x, pt.y)
  }, [tool, onDeselect, onAddShape])

  return (
    <svg
      ref={svgRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        cursor: tool === 'select' ? 'default' : 'crosshair',
        touchAction: 'none',   // hand touch handling entirely to JS
      }}
      onMouseDown={handleCanvasMouseDown}
      onTouchStart={handleCanvasMouseDown}
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e2d4a" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#16213e" />
      <rect width="100%" height="100%" fill="url(#grid)" />

      {shapes.map(shape => (
        <ShapeRenderer
          key={shape.id}
          shape={shape}
          onMouseDown={handleShapeMouseDown}
        />
      ))}

      {selectedShape && (
        <SelectionHandles
          shape={selectedShape}
          onResizeStart={handleResizeStart}
          onRotateStart={handleRotateStart}
        />
      )}
    </svg>
  )
}
