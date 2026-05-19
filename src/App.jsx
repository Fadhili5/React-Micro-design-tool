import React, { useState, useCallback, useEffect } from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
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

  // Keyboard shortcuts — plan.md Phase 8.
  // Suppressed when focus is in any input so typing doesn't trigger tool switches.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      switch (e.key) {
        case 'v': case 'V': setTool('select');   break
        case 'r': case 'R': setTool('rect');     break
        case 'e': case 'E': setTool('circle');   break
        case 't': case 'T': setTool('triangle'); break
        case 'x': case 'X': setTool('text');     break
        case 'Delete': case 'Backspace':
          if (selectedId) deleteShape(selectedId)
          break
        case 'Escape':
          clearSelection()
          setTool('select')
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, deleteShape, clearSelection])

  // Adding a shape auto-switches back to Select (plan.md Phase 8, validation.md T1).
  const handleAddShape = useCallback((type, x, y) => {
    addShape(type, x, y)
    setTool('select')
  }, [addShape])

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Toolbar tool={tool} onToolChange={setTool} />

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
