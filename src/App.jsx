import React, { useState, useEffect } from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import PropertiesPanel from './components/PropertiesPanel'
import MobileDrawer from './components/MobileDrawer'
import { useShapes } from './store/useShapes'
import { useIsMobile } from './hooks/useIsMobile'
import { TYPE_LABEL, TOOLS } from './utils/constants'

export default function App() {
  const [tool, setTool] = useState('select')
  const isMobile = useIsMobile()
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

  function handleAddShape(type, x, y) {
    addShape(type, x, y)
    setTool('select')
  }

  const canvas = (
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
  )

  // ----------------------------------------------------------------
  // MOBILE LAYOUT
  // ----------------------------------------------------------------
  if (isMobile) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#16213e', overflow: 'hidden' }}>

        <div style={{ position: 'absolute', inset: 0 }}>
          {canvas}
        </div>

        <header style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 'calc(var(--header-h) + var(--safe-top))',
          background: 'rgba(15,52,96,0.90)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(26,74,122,0.7)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0 16px 10px',
          paddingTop: 'var(--safe-top)',
          gap: '10px',
          zIndex: 30,
        }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#e0e0e0' }}>Micro Design</span>
          <span style={{ fontSize: '12px', color: '#6b8ab8' }}>
            {shapes.length} obj{selectedShape ? ` · ${TYPE_LABEL[selectedShape.type]}` : ''}
          </span>
          {selectedShape && (
            <button
              onClick={clearSelection}
              style={{
                marginLeft: 'auto',
                padding: '5px 14px',
                background: 'rgba(0,153,255,0.15)',
                border: '1px solid rgba(0,153,255,0.5)',
                borderRadius: '20px',
                color: '#0099ff',
                fontSize: '13px', fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          )}
        </header>

        {selectedShape && (
          <MobileDrawer
            shape={selectedShape}
            onUpdate={updateShape}
            onDelete={deleteShape}
            onBringToFront={() => bringToFront(selectedId)}
            onSendToBack={() => sendToBack(selectedId)}
            onClose={clearSelection}
          />
        )}

        <nav style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: 'var(--toolbar-total)',
          background: 'rgba(15,52,96,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(26,74,122,0.7)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          paddingBottom: 'var(--safe-bottom)',
          gap: '6px',
          zIndex: 30,
        }}>
          {TOOLS.map(t => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              style={{
                flex: 1,
                height: '48px',
                border: `2px solid ${tool === t.id ? '#0099ff' : 'transparent'}`,
                borderRadius: '12px',
                background: tool === t.id ? 'rgba(0,153,255,0.18)' : 'transparent',
                color: tool === t.id ? '#0099ff' : '#9ab0cc',
                fontSize: '22px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.1s, border-color 0.1s',
              }}
            >
              {t.icon}
            </button>
          ))}

          <div style={{ width: '1px', height: '28px', background: '#1a4a7a', flexShrink: 0, marginLeft: '2px' }} />
          <button
            onClick={() => { if (selectedId) deleteShape(selectedId) }}
            style={{
              width: '48px', height: '48px',
              border: 'none',
              borderRadius: '12px',
              background: selectedShape ? 'rgba(153,17,17,0.35)' : 'transparent',
              color: selectedShape ? '#ff6b6b' : '#2a4a7a',
              fontSize: '16px', fontWeight: 700,
              cursor: selectedShape ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
              flexShrink: 0,
            }}
          >
            Del
          </button>
        </nav>
      </div>
    )
  }

  // ----------------------------------------------------------------
  // DESKTOP LAYOUT
  // ----------------------------------------------------------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{
        display: 'flex', alignItems: 'center',
        height: '48px', padding: '0 16px', gap: '12px',
        background: '#0f3460', borderBottom: '1px solid #1a4a7a',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#e0e0e0' }}>Micro Design Tool</span>
        <span style={{ fontSize: '12px', color: '#6b8ab8' }}>
          {shapes.length} object{shapes.length !== 1 ? 's' : ''}
          {selectedShape ? ` · ${TYPE_LABEL[selectedShape.type]} selected` : ''}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#4a6a8a' }}>
          V=select · R=rect · E=ellipse · T=triangle · X=text · Del=delete · Esc=deselect
        </span>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Toolbar tool={tool} onToolChange={setTool} />
        {/* overflow:auto lets the canvas scroll when shapes extend beyond the viewport */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {canvas}
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
