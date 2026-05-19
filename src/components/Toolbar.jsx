import React from 'react'

const TOOLS = [
  { id: 'select',   icon: '↖',  title: 'Select (V)' },
  { id: 'rect',     icon: '▭',  title: 'Rectangle (R)' },
  { id: 'circle',   icon: '○',  title: 'Ellipse (E)' },
  { id: 'triangle', icon: '△',  title: 'Triangle (T)' },
  { id: 'text',     icon: 'T',  title: 'Text (X)' },
]

export default function Toolbar({ tool, onToolChange }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      padding: '12px 8px',
      background: '#0f3460',
      borderRight: '1px solid #1a4a7a',
      minWidth: '56px',
      alignItems: 'center',
    }}>
      <div style={{ fontSize: '10px', color: '#4a6a8a', marginBottom: '6px', fontWeight: 700, letterSpacing: '0.8px' }}>
        TOOLS
      </div>
      {TOOLS.map(t => (
        <button
          key={t.id}
          title={t.title}
          onClick={() => onToolChange(t.id)}
          style={{
            width: '40px',
            height: '40px',
            border: `2px solid ${tool === t.id ? '#0099ff' : 'transparent'}`,
            borderRadius: '8px',
            background: tool === t.id ? '#0099ff22' : 'transparent',
            color: tool === t.id ? '#0099ff' : '#9ab0cc',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.12s',
          }}
        >
          {t.icon}
        </button>
      ))}
    </div>
  )
}
