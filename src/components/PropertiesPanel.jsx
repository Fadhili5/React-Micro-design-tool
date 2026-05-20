import React from 'react'
import { TYPE_LABEL } from '../utils/constants'

function Label({ children }) {
  return (
    <div style={{ fontSize: '11px', color: '#6b8ab8', fontWeight: 600, marginBottom: '4px' }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: '10px', color: '#4a6a8a', fontWeight: 700,
      letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px',
    }}>
      {children}
    </div>
  )
}

function NumInput({ label, value, onChange, min, max, step = 1 }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <Label>{label}</Label>
      <input
        type="number"
        value={Math.round(value * 100) / 100}
        min={min} max={max} step={step}
        onChange={e => onChange(Number(e.target.value))}
        style={INPUT}
      />
    </div>
  )
}

// Color picker requires a valid 6-digit hex; text field accepts raw values like 'none'.
function ColorField({ label, value, onChange }) {
  const safeHex = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'
  return (
    <div style={{ marginBottom: '8px' }}>
      <Label>{label}</Label>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <input
          type="color" value={safeHex}
          onChange={e => onChange(e.target.value)}
          style={{ width: '32px', height: '28px', border: 'none', borderRadius: '4px', padding: '2px', background: 'transparent', cursor: 'pointer' }}
        />
        <input
          type="text" value={value}
          onChange={e => onChange(e.target.value)}
          style={{ ...INPUT, flex: 1 }}
        />
      </div>
    </div>
  )
}

export default function PropertiesPanel({
  shape, onUpdate, onDelete, onBringToFront, onSendToBack,
}) {
  if (!shape) {
    return (
      <div style={{ ...PANEL, justifyContent: 'center', color: '#4a6a8a', fontSize: '13px', textAlign: 'center', lineHeight: 1.6 }}>
        Select an object to edit its properties
      </div>
    )
  }

  const upd = (key) => (val) => onUpdate(shape.id, { [key]: val })

  return (
    <div style={{ ...PANEL, justifyContent: 'flex-start' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#9ab0cc', marginBottom: '16px' }}>
        {TYPE_LABEL[shape.type] ?? shape.type}
      </div>

      <div style={{ marginBottom: '18px' }}>
        <SectionTitle>Transform</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <NumInput label="X" value={shape.x} onChange={upd('x')} />
          <NumInput label="Y" value={shape.y} onChange={upd('y')} />
          <NumInput label="W" value={shape.width}  onChange={v => onUpdate(shape.id, { width:  Math.max(20, v) })} min={20} />
          <NumInput label="H" value={shape.height} onChange={v => onUpdate(shape.id, { height: Math.max(20, v) })} min={20} />
        </div>
        <NumInput label="Rotation (°)" value={shape.rotation || 0} onChange={upd('rotation')} min={0} max={360} />
      </div>

      <div style={{ marginBottom: '18px' }}>
        <SectionTitle>Appearance</SectionTitle>

        <ColorField label="Fill" value={shape.fill} onChange={upd('fill')} />

        {shape.type !== 'text' && (
          <>
            {/* Checkbox prevents exposing 'none' to the color-picker, which requires a valid hex. */}
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={shape.stroke !== 'none'}
                  onChange={e => onUpdate(shape.id, { stroke: e.target.checked ? '#2C7873' : 'none' })}
                />
                <span style={{ fontSize: '11px', color: '#6b8ab8', fontWeight: 600 }}>Enable Stroke</span>
              </label>
            </div>
            {shape.stroke !== 'none' && (
              <>
                <ColorField label="Stroke Color" value={shape.stroke} onChange={upd('stroke')} />
                <NumInput label="Stroke Width" value={shape.strokeWidth} onChange={upd('strokeWidth')} min={0} max={20} step={0.5} />
              </>
            )}
          </>
        )}

        <div style={{ marginBottom: '8px' }}>
          <Label>Opacity: {Math.round((shape.opacity ?? 1) * 100)}%</Label>
          <input
            type="range" min={0} max={1} step={0.01}
            value={shape.opacity ?? 1}
            onChange={e => onUpdate(shape.id, { opacity: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {shape.type === 'text' && (
        <div style={{ marginBottom: '18px' }}>
          <SectionTitle>Text</SectionTitle>
          <div style={{ marginBottom: '8px' }}>
            <Label>Content</Label>
            <input
              type="text" value={shape.text ?? ''}
              onChange={e => onUpdate(shape.id, { text: e.target.value })}
              style={INPUT}
            />
          </div>
          <NumInput label="Font Size" value={shape.fontSize ?? 16} onChange={upd('fontSize')} min={8} max={120} />
        </div>
      )}

      <div style={{ marginBottom: '18px' }}>
        <SectionTitle>Layer</SectionTitle>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={onBringToFront} style={LAYER_BTN}>▲ Front</button>
          <button onClick={onSendToBack}   style={LAYER_BTN}>▼ Back</button>
        </div>
      </div>

      <button
        onClick={() => onDelete(shape.id)}
        style={{
          marginTop: 'auto', width: '100%', padding: '8px',
          background: '#991111', border: 'none', borderRadius: '8px',
          color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
        }}
      >
        Delete
      </button>
    </div>
  )
}

const PANEL = {
  width: '220px', padding: '16px',
  background: '#0f3460', borderLeft: '1px solid #1a4a7a',
  overflowY: 'auto', display: 'flex', flexDirection: 'column', flexShrink: 0,
}

const INPUT = {
  width: '100%', padding: '5px 8px',
  background: '#16213e', border: '1px solid #1a4a7a',
  borderRadius: '6px', color: '#e0e0e0', fontSize: '13px',
}

const LAYER_BTN = {
  flex: 1, padding: '6px',
  background: '#16213e', border: '1px solid #1a4a7a',
  borderRadius: '6px', color: '#9ab0cc',
  cursor: 'pointer', fontSize: '11px', fontWeight: 600,
}
