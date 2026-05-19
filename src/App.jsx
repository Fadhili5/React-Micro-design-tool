import React, { useState, useCallback, useEffect } from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import PropertiesPanel from './components/PropertiesPanel'
import { useShapes } from './store/useShapes'

const TYPE_LABEL = {
  rect: 'Rectangle', circle: 'Ellipse', triangle: 'Triangle', text: 'Text',
}

// Phase 9: adds header with object-count status bar and shortcut hint bar (plan.md Phase 9).
// Full three-column layout: Toolbar | Canvas | PropertiesPanel (architecture.md).
export default function App() {
  const [tool, setTool] = useState('select')
  const {
    shapes, selectedId, selectedShape,
    addShape, updateShape, deleteShape,
    bringToFront, sendToBack,
    selectShape, clearSelection,
  } = useShapes()

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

  const handleAddShape = useCallback((type, x, y) => {
    addShape(type, x, y)
    setTool('select')
  }, [addShape])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* Header: status bar (object count + selected type) + shortcut hint bar */}
      <header style={{
        display: 'flex', alignItems: 'center',
        height: '48px', padding: '0 16px', gap: '12px',
        background: '#0f3460', borderBottom: '1px solid #1a4a7a',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#e0e0e0' }}>
          ✦ Micro Design Tool
        </span>
        <span style={{ fontSize: '12px', color: '#6b8ab8' }}>
          {shapes.length} object{shapes.length !== 1 ? 's' : ''}
          {selectedShape ? ` · ${TYPE_LABEL[selectedShape.type]} selected` : ''}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#4a6a8a' }}>
          V=select · R=rect · E=ellipse · T=triangle · X=text · Del=delete · Esc=deselect
        </span>
      </header>

      {/* Three-column layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
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
    </div>
  )
}
