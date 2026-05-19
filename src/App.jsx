import React, { useState, useCallback } from 'react'
import Canvas from './components/Canvas'
import PropertiesPanel from './components/PropertiesPanel'
import { useShapes } from './store/useShapes'

export default function App() {
  const [tool, setTool] = useState('select')
  const {
    shapes, selectedId, selectedShape,
    addShape, updateShape, deleteShape,
    bringToFront, sendToBack,
    selectShape, clearSelection,
  } = useShapes()

  const handleAddShape = useCallback((type, x, y) => {
    addShape(type, x, y)
    setTool('select')
  }, [addShape])

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, overflow: 'hidden' }}>
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
      <PropertiesPanel
        shape={selectedShape}
        onUpdate={updateShape}
        onDelete={deleteShape}
        onBringToFront={() => selectedId && bringToFront(selectedId)}
        onSendToBack={()  => selectedId && sendToBack(selectedId)}
      />
    </div>
  )
}
