import { useState, useCallback } from 'react'

let idCounter = 10
function createId() {
  return `shape-${idCounter++}`
}

function makeShape(type, x, y) {
  const base = {
    id: createId(),
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
        fill: '#ffffff',
        stroke: 'none',
        strokeWidth: 0,
        text: 'Edit me',
        fontSize: 20,
      }
    default:
      return { ...base, x: x - 50, y: y - 50, width: 100, height: 100 }
  }
}

const INITIAL_SHAPES = [
  {
    id: 'shape-1', type: 'rect',
    x: 80, y: 140, width: 180, height: 110,
    fill: '#4ECDC4', stroke: '#2C7873', strokeWidth: 2, opacity: 1, rotation: 0,
  },
  {
    id: 'shape-2', type: 'circle',
    x: 340, y: 110, width: 140, height: 140,
    fill: '#FF6B6B', stroke: '#CC3333', strokeWidth: 2, opacity: 1, rotation: 0,
  },
  {
    id: 'shape-3', type: 'triangle',
    x: 570, y: 130, width: 130, height: 130,
    fill: '#FFE66D', stroke: '#CCA800', strokeWidth: 2, opacity: 1, rotation: 0,
  },
  {
    id: 'shape-4', type: 'rect',
    x: 200, y: 320, width: 160, height: 100,
    fill: '#A855F7', stroke: '#7C3AED', strokeWidth: 2, opacity: 0.85, rotation: -12,
  },
  {
    id: 'shape-5', type: 'text',
    x: 160, y: 460, width: 380, height: 44,
    fill: '#e0e0e0', stroke: 'none', strokeWidth: 0, opacity: 1, rotation: 0,
    text: 'Click a shape to select and edit it', fontSize: 20,
  },
]

export function useShapes() {
  const [shapes, setShapes] = useState(INITIAL_SHAPES)
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

  const selectShape = useCallback((id) => setSelectedId(id), [])
  const clearSelection = useCallback(() => setSelectedId(null), [])

  const selectedShape = shapes.find(s => s.id === selectedId) ?? null

  return {
    shapes, selectedId, selectedShape,
    addShape, updateShape, deleteShape,
    bringToFront, sendToBack,
    selectShape, clearSelection,
  }
}
