import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, Suspense } from 'react'
import SolarSystem from './components/SolarSystem'
import Info from './components/Info'
import './App.css'

function App() {
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)

  return (
    <>
      <Canvas
        camera={{ position: [0, 50, 100], fov: 60 }}
        style={{ background: '#000' }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <SolarSystem showOrbits={showOrbits} showLabels={showLabels} />
          <OrbitControls 
            enableDamping 
            dampingFactor={0.05} 
            minDistance={20} 
            maxDistance={300}
          />
        </Suspense>
      </Canvas>
      
      <Info />
      <div className="controls">
        <button onClick={() => setShowOrbits(!showOrbits)}>
          {showOrbits ? 'Hide' : 'Show'} Orbits
        </button>
        <button onClick={() => setShowLabels(!showLabels)}>
          {showLabels ? 'Hide' : 'Show'} Labels
        </button>
        <button onClick={() => {
          const canvas = document.querySelector('canvas')
          if (canvas) {
            canvas.style.transform = 'none'
            const event = new CustomEvent('orbit-controls-reset')
            window.dispatchEvent(event)
          }
        }}>Reset Camera</button>
      </div>
    </>
  )
}

export default App
