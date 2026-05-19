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

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      switch (e.key) {
        case 'v': case 'V': setTool('select'); break
        case 'r': case 'R': setTool('rect'); break
        case 'e': case 'E': setTool('circle'); break
        case 't': case 'T': setTool('triangle'); break
        case 'x': case 'X': setTool('text'); break
        case 'Delete': case 'Backspace':
          if (selectedId) deleteShape(selectedId)
          break
        case 'Escape': clearSelection(); setTool('select'); break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedId, deleteShape, clearSelection])

  const handleAddShape = useCallback((type, x, y) => {
    addShape(type, x, y)
    setTool('select')
  }, [addShape])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        height: '48px',
        background: '#0f3460',
        borderBottom: '1px solid #1a4a7a',
        gap: '12px',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#e0e0e0', letterSpacing: '0.5px' }}>
          ✦ Micro Design Tool
        </div>
        <div style={{ fontSize: '12px', color: '#6b8ab8' }}>
          {shapes.length} object{shapes.length !== 1 ? 's' : ''}
          {selectedShape ? ` · ${selectedShape.type} selected` : ''}
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#4a6a8a' }}>
          V=select · R=rect · E=ellipse · T=triangle · X=text · Del=delete
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Toolbar tool={tool} onToolChange={setTool} />
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
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
          onSendToBack={() => selectedId && sendToBack(selectedId)}
        />
      </div>
    </div>
  )
}
