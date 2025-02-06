import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const Planet = ({ name, radius, distance, color, period, showOrbit, showLabel }) => {
  const planetRef = useRef()

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    const angle = (elapsedTime / period) * 0.3

    // Update planet position
    if (planetRef.current) {
      planetRef.current.position.x = Math.cos(angle) * distance
      planetRef.current.position.z = Math.sin(angle) * distance
      planetRef.current.rotation.y += 0.005
    }
  })

  return (
    <group>
      {/* Planet */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius * 2, 32, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.5}
          emissive={color}
          emissiveIntensity={0.2}
        />
        {showLabel && (
          <Html distanceFactor={15}>
            <div className="planet-label" style={{
              color: 'white',
              fontSize: '1.5em',
              fontWeight: 'bold',
              textShadow: '0 0 5px black',
              whiteSpace: 'nowrap'
            }}>{name}</div>
          </Html>
        )}
      </mesh>

      {/* Orbit */}
      {showOrbit && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[distance, distance + 0.1, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            opacity={0.2}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}

export default Planet 