import React, { useRef, useCallback, useEffect } from 'react'
import ShapeRenderer from './ShapeRenderer'

// Phase 4: select shapes by clicking, move them by dragging.
// dragRef stores ephemeral drag state (useRef not useState — no mid-drag re-renders).
// mousemove/mouseup attached to window so drag survives leaving the SVG (agents.md fix).
export default function Canvas({
  shapes, selectedId,
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
      // architecture.md drag flow
      onUpdate(d.id, {
        x: d.origX + pt.x - d.startX,
        y: d.origY + pt.y - d.startY,
      })
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

  // Select the shape and start a move drag.
  const handleShapeMouseDown = useCallback((e, id) => {
    if (tool !== 'select') return   // let event bubble so canvas can place a new shape
    e.stopPropagation()             // prevent canvas deselect
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

  // Deselect (select tool) or place a new shape (shape tool).
  const handleCanvasMouseDown = useCallback((e) => {
    if (tool === 'select') { onDeselect(); return }
    const pt = getSVGPoint(e)
    onAddShape(tool, pt.x, pt.y)
  }, [tool, onDeselect, onAddShape])

  return (
    <svg
      ref={svgRef}
      style={{
        display: 'block',   // eliminates 4px baseline gap (agents.md fix)
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
    </svg>
  )
}
