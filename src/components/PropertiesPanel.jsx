import React from 'react'

function Label({ children }) {
  return (
    <div style={{ fontSize: '11px', color: '#6b8ab8', marginBottom: '4px', fontWeight: 600 }}>
      {children}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{
        fontSize: '10px', color: '#4a6a8a', marginBottom: '8px',
        fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase',
      }}>
        {title}
      </div>
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
        style={{
          width: '100%', padding: '5px 8px',
          background: '#16213e', border: '1px solid #1a4a7a',
          borderRadius: '6px', color: '#e0e0e0', fontSize: '13px',
        }}
      />
    </div>
  )
}

function ColorRow({ label, value, onChange }) {
  const safeHex = value === 'none' ? '#000000' : value
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
          style={{ flex: 1, padding: '5px 8px', background: '#16213e', border: '1px solid #1a4a7a', borderRadius: '6px', color: '#e0e0e0', fontSize: '12px' }}
        />
      </div>
    </div>
  )
}

export default function PropertiesPanel({ shape, onUpdate, onDelete, onBringToFront, onSendToBack }) {
  if (!shape) {
    return (
      <div style={{
        width: '220px', padding: '20px',
        background: '#0f3460', borderLeft: '1px solid #1a4a7a',
        color: '#4a6a8a', fontSize: '13px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', lineHeight: 1.6,
      }}>
        Select an object to edit its properties
      </div>
    )
  }

  const upd = (key) => (val) => onUpdate(shape.id, { [key]: val })

  return (
    <div style={{
      width: '220px', padding: '16px',
      background: '#0f3460', borderLeft: '1px solid #1a4a7a',
      overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0',
    }}>
      <div style={{ fontSize: '12px', color: '#9ab0cc', marginBottom: '16px', fontWeight: 600 }}>
        {shape.type.charAt(0).toUpperCase() + shape.type.slice(1)}
      </div>

      <Section title="Transform">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <NumInput label="X" value={shape.x} onChange={upd('x')} />
          <NumInput label="Y" value={shape.y} onChange={upd('y')} />
          <NumInput label="W" value={shape.width}  onChange={v => onUpdate(shape.id, { width:  Math.max(20, v) })} min={20} />
          <NumInput label="H" value={shape.height} onChange={v => onUpdate(shape.id, { height: Math.max(20, v) })} min={20} />
        </div>
        <NumInput label="Rotation (°)" value={shape.rotation || 0} onChange={upd('rotation')} min={0} max={360} />
      </Section>

      <Section title="Appearance">
        <ColorRow label="Fill" value={shape.fill} onChange={upd('fill')} />

        {shape.type !== 'text' && (
          <>
            <div style={{ marginBottom: '6px' }}>
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
                <ColorRow label="Stroke Color" value={shape.stroke} onChange={upd('stroke')} />
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
      </Section>

      {shape.type === 'text' && (
        <Section title="Text">
          <div style={{ marginBottom: '8px' }}>
            <Label>Content</Label>
            <input
              type="text" value={shape.text}
              onChange={e => onUpdate(shape.id, { text: e.target.value })}
              style={{ width: '100%', padding: '5px 8px', background: '#16213e', border: '1px solid #1a4a7a', borderRadius: '6px', color: '#e0e0e0', fontSize: '13px' }}
            />
          </div>
          <NumInput label="Font Size" value={shape.fontSize} onChange={upd('fontSize')} min={8} max={120} />
        </Section>
      )}

      <Section title="Layer">
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={onBringToFront} style={layerBtn}>▲ Front</button>
          <button onClick={onSendToBack}  style={layerBtn}>▼ Back</button>
        </div>
      </Section>

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

const layerBtn = {
  flex: 1, padding: '6px',
  background: '#16213e', border: '1px solid #1a4a7a',
  borderRadius: '6px', color: '#9ab0cc',
  cursor: 'pointer', fontSize: '11px', fontWeight: 600,
}
