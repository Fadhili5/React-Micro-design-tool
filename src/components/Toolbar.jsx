import React from 'react'
import { TOOLS } from '../utils/constants'

export default function Toolbar({ tool, onToolChange }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '12px 8px',
      background: '#0f3460',
      borderRight: '1px solid #1a4a7a',
      minWidth: '56px',
      flexShrink: 0,
    }}>
      <div style={{
        fontSize: '10px', color: '#4a6a8a',
        fontWeight: 700, letterSpacing: '0.8px', marginBottom: '6px',
      }}>
        TOOLS
      </div>

      {TOOLS.map(t => (
        <button
          key={t.id}
          title={`${t.label} (${t.hint})`}
          onClick={() => onToolChange(t.id)}
          style={{
            width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', cursor: 'pointer',
            border: `2px solid ${tool === t.id ? '#0099ff' : 'transparent'}`,
            borderRadius: '8px',
            background: tool === t.id ? 'rgba(0,153,255,0.12)' : 'transparent',
            color: tool === t.id ? '#0099ff' : '#9ab0cc',
            transition: 'border-color 0.12s, background 0.12s, color 0.12s',
          }}
        >
          {t.icon}
        </button>
      ))}
    </div>
  )
}
