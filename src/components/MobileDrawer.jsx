import React from 'react'
import { TYPE_LABEL } from '../utils/constants'

// font-size below 16px triggers auto-zoom on iOS Safari.
const INP = {
  width: '100%',
  padding: '10px 12px',
  fontSize: '16px',
  background: '#16213e',
  border: '1px solid #1a4a7a',
  borderRadius: '10px',
  color: '#e0e0e0',
  appearance: 'none',
  WebkitAppearance: 'none',
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '10px', color: '#4a6a8a',
      fontWeight: 700, letterSpacing: '0.8px',
      textTransform: 'uppercase',
      marginTop: '16px', marginBottom: '10px',
    }}>
      {children}
    </div>
  )
}

function FieldLabel({ children }) {
  return (
    <div style={{ fontSize: '12px', color: '#6b8ab8', fontWeight: 600, marginBottom: '5px' }}>
      {children}
    </div>
  )
}

function NumIn({ label, value, onChange, min, max, step = 1 }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type="number"
        value={Math.round(value * 10) / 10}
        min={min} max={max} step={step}
        onChange={e => onChange(Number(e.target.value))}
        style={INP}
      />
    </div>
  )
}

// Color picker requires a valid 6-digit hex; text field accepts raw values like 'none'.
function ColorIn({ label, value, onChange }) {
  const hex = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="color"
          value={hex}
          onChange={e => onChange(e.target.value)}
          style={{ width: '48px', height: '44px', border: 'none', borderRadius: '10px', padding: '3px', background: 'transparent', cursor: 'pointer', flexShrink: 0 }}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ ...INP, flex: 1 }}
        />
      </div>
    </div>
  )
}

export default function MobileDrawer({ shape, onUpdate, onDelete, onBringToFront, onSendToBack, onClose }) {
  if (!shape) return null
  const upd = (key) => (val) => onUpdate(shape.id, { [key]: val })

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'var(--toolbar-total)',
        left: 0, right: 0,
        maxHeight: '56vh',
        background: '#0d2b50',
        borderTop: '2px solid #0099ff',
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{
        flexShrink: 0,
        padding: '0 16px 12px',
        borderBottom: '1px solid #1a4a7a',
        background: '#0d2b50',
        borderRadius: '20px 20px 0 0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', paddingBottom: '8px' }}>
          <div style={{ width: '40px', height: '4px', background: '#2a4a7a', borderRadius: '2px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#e0e0e0' }}>
            {TYPE_LABEL[shape.type] ?? shape.type}
          </span>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '32px', height: '32px',
              color: '#9ab0cc', fontSize: '18px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: '0 16px 16px', overflowY: 'auto' }}>
        <SectionLabel>Transform</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <NumIn label="X" value={shape.x} onChange={upd('x')} />
          <NumIn label="Y" value={shape.y} onChange={upd('y')} />
          <NumIn label="W" value={shape.width}  onChange={v => onUpdate(shape.id, { width:  Math.max(20, v) })} min={20} />
          <NumIn label="H" value={shape.height} onChange={v => onUpdate(shape.id, { height: Math.max(20, v) })} min={20} />
        </div>
        <NumIn label="Rotation °" value={shape.rotation || 0} onChange={upd('rotation')} min={0} max={360} />

        <SectionLabel>Appearance</SectionLabel>
        <ColorIn label="Fill" value={shape.fill} onChange={upd('fill')} />
        {shape.type !== 'text' && (
          <>
            <div style={{ margin: '12px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={shape.stroke !== 'none'}
                  onChange={e => onUpdate(shape.id, { stroke: e.target.checked ? '#2C7873' : 'none' })}
                  style={{ width: '22px', height: '22px', accentColor: '#0099ff', cursor: 'pointer', flexShrink: 0 }}
                />
                <span style={{ fontSize: '14px', color: '#9ab0cc', fontWeight: 600 }}>Enable Stroke</span>
              </label>
            </div>
            {shape.stroke !== 'none' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <ColorIn label="Stroke Color" value={shape.stroke} onChange={upd('stroke')} />
                <NumIn label="Stroke Width" value={shape.strokeWidth} onChange={upd('strokeWidth')} min={0} max={20} step={0.5} />
              </div>
            )}
          </>
        )}
        <div style={{ marginTop: '12px' }}>
          <FieldLabel>Opacity: {Math.round((shape.opacity ?? 1) * 100)}%</FieldLabel>
          <input
            type="range" min={0} max={1} step={0.01}
            value={shape.opacity ?? 1}
            onChange={e => onUpdate(shape.id, { opacity: Number(e.target.value) })}
            style={{ width: '100%', height: '6px', cursor: 'pointer' }}
          />
        </div>

        {shape.type === 'text' && (
          <>
            <SectionLabel>Text</SectionLabel>
            <div style={{ marginBottom: '10px' }}>
              <FieldLabel>Content</FieldLabel>
              <input
                type="text"
                value={shape.text ?? ''}
                onChange={e => onUpdate(shape.id, { text: e.target.value })}
                style={INP}
              />
            </div>
            <NumIn label="Font Size" value={shape.fontSize ?? 16} onChange={upd('fontSize')} min={8} max={120} />
          </>
        )}

        <SectionLabel>Layer</SectionLabel>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <button onClick={onBringToFront} style={LAYER_BTN}>▲ Bring Front</button>
          <button onClick={onSendToBack}   style={LAYER_BTN}>▼ Send Back</button>
        </div>

        <button
          onClick={() => { onDelete(shape.id); onClose() }}
          style={{
            width: '100%', padding: '15px',
            background: '#991111', border: 'none', borderRadius: '14px',
            color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: 700,
            letterSpacing: '0.3px',
          }}
        >
          Delete Shape
        </button>
      </div>
    </div>
  )
}

const LAYER_BTN = {
  flex: 1, padding: '12px',
  background: '#16213e', border: '1px solid #1a4a7a',
  borderRadius: '12px', color: '#9ab0cc',
  cursor: 'pointer', fontSize: '13px', fontWeight: 600,
}
