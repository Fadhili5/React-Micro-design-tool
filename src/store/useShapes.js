import { useState, useCallback } from 'react'

let nextId = 10
function uid() {
  return `shape-${nextId++}`
}

// Shape schema (plan.md Phase 2):
// { id, type, x, y, width, height, fill, stroke, strokeWidth, opacity, rotation }
// text extras: text, fontSize
function makeShape(type, x, y) {
  const base = {
    id: uid(),
    type,
    fill: '#4ECDC4',
    stroke: '#2C7873',
    strokeWidth: 2,
    opacity: 1,
    rotation: 0,
  }
  switch (type) {
    case 'rect':
      return { ...base, x: x - 60, y: y - 40, width: 120, height: 80 }
    case 'circle':
      return { ...base, x: x - 50, y: y - 50, width: 100, height: 100 }
    case 'triangle':
      return { ...base, x: x - 55, y: y - 55, width: 110, height: 110 }
    case 'text':
      return {
        ...base,
        x: x - 100, y: y - 20,
        width: 200, height: 40,
        fill: '#e0e0e0',
        stroke: 'none',
        strokeWidth: 0,
        text: 'Edit me',
        fontSize: 20,
      }
    default:
      return { ...base, x: x - 50, y: y - 50, width: 100, height: 100 }
  }
}

// 5 sample shapes so the canvas is not blank on first load.
const INITIAL_SHAPES = [
  {
    id: 'shape-1', type: 'rect',
    x: 80, y: 130, width: 200, height: 120,
    fill: '#4ECDC4', stroke: '#2C7873', strokeWidth: 2, opacity: 1, rotation: 0,
  },
  {
    id: 'shape-2', type: 'circle',
    x: 350, y: 100, width: 140, height: 140,
    fill: '#FF6B6B', stroke: '#CC3333', strokeWidth: 2, opacity: 1, rotation: 0,
  },
  {
    id: 'shape-3', type: 'triangle',
    x: 570, y: 120, width: 130, height: 130,
    fill: '#FFE66D', stroke: '#CC9900', strokeWidth: 2, opacity: 1, rotation: 0,
  },
  {
    id: 'shape-4', type: 'rect',
    x: 200, y: 310, width: 160, height: 100,
    fill: '#A855F7', stroke: '#7C3AED', strokeWidth: 2, opacity: 0.85, rotation: -15,
  },
  {
    id: 'shape-5', type: 'text',
    x: 130, y: 460, width: 400, height: 48,
    fill: '#e0e0e0', stroke: 'none', strokeWidth: 0, opacity: 1, rotation: 0,
    text: 'Click a shape to select it', fontSize: 22,
  },
]

export function useShapes() {
  const [shapes, setShapes]     = useState(INITIAL_SHAPES)
  const [selectedId, setSelectedId] = useState(null)

  const addShape = useCallback((type, x, y) => {
    const shape = makeShape(type, x, y)
    setShapes(prev => [...prev, shape])
    setSelectedId(shape.id)
    return shape
  }, [])

  const updateShape = useCallback((id, updates) => {
    setShapes(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }, [])

  const deleteShape = useCallback((id) => {
    setShapes(prev => prev.filter(s => s.id !== id))
    setSelectedId(prev => prev === id ? null : prev)
  }, [])

  const bringToFront = useCallback((id) => {
    setShapes(prev => {
      const shape = prev.find(s => s.id === id)
      return shape ? [...prev.filter(s => s.id !== id), shape] : prev
    })
  }, [])

  const sendToBack = useCallback((id) => {
    setShapes(prev => {
      const shape = prev.find(s => s.id === id)
      return shape ? [shape, ...prev.filter(s => s.id !== id)] : prev
    })
  }, [])

  const selectShape    = useCallback((id) => setSelectedId(id), [])
  const clearSelection = useCallback(() => setSelectedId(null), [])

  // Derived — architecture.md: shapes.find(s => s.id === selectedId)
  const selectedShape = shapes.find(s => s.id === selectedId) ?? null

  return {
    shapes, selectedId, selectedShape,
    addShape, updateShape, deleteShape,
    bringToFront, sendToBack,
    selectShape, clearSelection,
  }
}
