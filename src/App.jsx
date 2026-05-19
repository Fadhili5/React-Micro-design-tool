import React, { useState, useCallback } from 'react'
import Canvas from './components/Canvas'
import { useShapes } from './store/useShapes'

export default function App() {
  const [tool, setTool] = useState('select')
  const {
    shapes, selectedId, selectedShape,
    addShape, updateShape,
    selectShape, clearSelection,
  } = useShapes()

  // Adding a shape switches tool back to Select so next click doesn't add another (plan.md Phase 8).
  const handleAddShape = useCallback((type, x, y) => {
    addShape(type, x, y)
    setTool('select')
  }, [addShape])

  return (
    <div style={{ height: '100vh' }}>
      <Canvas
        shapes={shapes}
        selectedId={selectedId}
        selectedShape={selectedShape}
        onSelect={selectShape}
        onDeselect={clearSelection}
        onUpdate={updateShape}
        tool={tool}
        onAddShape={handleAddShape}
      />
    </div>
  )
}
