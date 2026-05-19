import React from 'react'
import { useShapes } from './store/useShapes'

export default function App() {
  const { shapes } = useShapes()

  return (
    <div style={{ padding: '24px', background: '#1a1a2e', color: '#e0e0e0', height: '100vh' }}>
      <h2 style={{ marginBottom: '8px' }}>Micro Design Tool</h2>
      <p style={{ color: '#6b8ab8' }}>{shapes.length} shapes loaded in state</p>
    </div>
  )
}
