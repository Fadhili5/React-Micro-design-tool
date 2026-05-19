import React from 'react'
import Canvas from './components/Canvas'
import { useShapes } from './store/useShapes'

export default function App() {
  const { shapes } = useShapes()

  return (
    <div style={{ height: '100vh' }}>
      <Canvas shapes={shapes} />
    </div>
  )
}
