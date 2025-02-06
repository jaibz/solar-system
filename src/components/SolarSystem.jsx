import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import Planet from './Planet'

const PLANETS_DATA = [
  { name: 'Mercury', radius: 0.383, distance: 10, color: '#A0A0A0', period: 0.24 },
  { name: 'Venus', radius: 0.949, distance: 15, color: '#FFE85C', period: 0.62 },
  { name: 'Earth', radius: 1, distance: 20, color: '#4B9FE1', period: 1 },
  { name: 'Mars', radius: 0.532, distance: 25, color: '#FF6B4B', period: 1.88 },
  { name: 'Jupiter', radius: 11.21, distance: 35, color: '#FFB347', period: 11.86 },
  { name: 'Saturn', radius: 9.45, distance: 45, color: '#FFD700', period: 29.46 },
  { name: 'Uranus', radius: 4, distance: 55, color: '#7FFFD4', period: 84 },
  { name: 'Neptune', radius: 3.88, distance: 65, color: '#4169E1', period: 164.79 }
]

const SolarSystem = ({ showOrbits, showLabels }) => {
  const starsRef = useRef()

  useEffect(() => {
    if (starsRef.current) {
      const vertices = []
      for (let i = 0; i < 10000; i++) {
        vertices.push(
          (Math.random() - 0.5) * 2000, // x
          (Math.random() - 0.5) * 2000, // y
          (Math.random() - 0.5) * 2000  // z
        )
      }
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
      starsRef.current.geometry = geometry
    }
  }, [])

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 0, 0]} intensity={8} distance={1000} />
      
      <pointLight position={[500, 0, 0]} intensity={2} distance={1000} color="#ffffff" />
      <pointLight position={[-500, 0, 0]} intensity={2} distance={1000} color="#ffffff" />
      <pointLight position={[0, 500, 0]} intensity={2} distance={1000} color="#ffffff" />
      <pointLight position={[0, -500, 0]} intensity={2} distance={1000} color="#ffffff" />

      {/* Stars */}
      <points ref={starsRef}>
        <pointsMaterial size={0.1} color="#ffffff" />
      </points>

      {/* Sun */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.6} />
        {showLabels && (
          <Html distanceFactor={15}>
            <div className="planet-label">Sun</div>
          </Html>
        )}
      </mesh>

      {/* Planets */}
      {PLANETS_DATA.map((planet) => (
        <Planet
          key={planet.name}
          {...planet}
          showOrbit={showOrbits}
          showLabel={showLabels}
        />
      ))}
    </>
  )
}

export default SolarSystem 