import React, { useRef, useCallback, useEffect } from 'react'
import ShapeRenderer from './ShapeRenderer'
import SelectionHandles from './SelectionHandles'
import { unrotatePoint } from '../utils/geometry'

// Phase 5: adds resize handling using rotation-aware unrotate math (architecture.md).
export default function Canvas({
  shapes, selectedId, selectedShape,
  onSelect, onDeselect, onUpdate,
  tool, onAddShape,
}) {
  const svgRef  = useRef(null)
  const dragRef = useRef(null)

  function getSVGPoint(e) {
    const rect = svgRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current) return
    const pt = getSVGPoint(e)
    const d  = dragRef.current

    if (d.type === 'move') {
      onUpdate(d.id, {
        x: d.origX + pt.x - d.startX,
        y: d.origY + pt.y - d.startY,
      })

    } else if (d.type === 'resize') {
      const { orig, handle } = d
      // Use ORIGINAL center captured at mousedown (agents.md fix).
      const cx = orig.x + orig.width  / 2
      const cy = orig.y + orig.height / 2

      // Unrotate both points into the shape's local frame (architecture.md resize math).
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

  useEffect(() => {
    const onMove = (e) => handleMouseMove(e)
    const onUp   = ()  => { dragRef.current = null }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }
  }, [handleMouseMove])

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
      orig: { ...selectedShape },   // full snapshot; orig.id used in onUpdate
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
      }}
      onMouseDown={handleCanvasMouseDown}
    >
      <rect width="100%" height="100%" fill="#16213e" />

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
        />
      )}
    </svg>
  )
}
