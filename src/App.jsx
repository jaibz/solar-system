import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Label component with fixed size
// Label component with fixed size
function FixedLabel({ children, position, visible, showLabels }) {
  const { camera } = useThree();
  const htmlRef = useRef();

  useFrame(() => {
    if (htmlRef.current) {
      const distance = camera.position.distanceTo(new THREE.Vector3(...position));
      const scale = distance / 50;
      htmlRef.current.style.setProperty('--scale', scale);
    }
  });

  const shouldShow = showLabels || visible;

  return (
    <Html
      position={position}
      style={{
        transition: 'opacity 0.2s',
        opacity: shouldShow ? 1 : 0,
        pointerEvents: 'none',
      }}
      occlude
    >
      <div 
        ref={htmlRef} 
        className="label-container"
        style={{
          padding: '10px',
          margin: '-10px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '5px',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        {children}
      </div>
    </Html>
  );
}

// Planet component with customizable properties and label
function Planet({ name, position, size, textureUrl, orbitRadius, orbitSpeed, rotationSpeed, rings, showLabels, showOrbits }) {
  const meshRef = useRef();
  const ringsRef = useRef();
  const orbitRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const hoverSize = size * 5; // Increased hover area

  useFrame((state, delta) => {
    meshRef.current.rotation.y += rotationSpeed * delta;
    orbitRef.current += orbitSpeed * delta;
    const newX = Math.cos(orbitRef.current) * orbitRadius;
    const newZ = Math.sin(orbitRef.current) * orbitRadius;
    meshRef.current.position.x = newX;
    meshRef.current.position.z = newZ;
    
    if (rings) {
      ringsRef.current.position.x = newX;
      ringsRef.current.position.z = newZ;
      ringsRef.current.rotation.x = 0.5;
    }
  });

  return (
    <>
      {showOrbits && (
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[orbitRadius, orbitRadius + 0.1, 128]} />
          <meshBasicMaterial color="#ffffff" opacity={0.15} transparent={true} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Invisible hover detection sphere */}
      <mesh 
        position={meshRef.current ? [meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z] : position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[hoverSize, 16, 16]} />
        <meshBasicMaterial visible={false} transparent={true} opacity={0} />
      </mesh>
      <mesh 
        ref={meshRef} 
        position={position}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          map={new THREE.TextureLoader().load(textureUrl)}
          metalness={0.1}
          roughness={0.4}
          emissive="#444444"
          emissiveIntensity={0.1}
        />
        <FixedLabel 
          position={[0, size * 1.5, 0]} 
          visible={hovered}
          showLabels={showLabels}
        >
          {name}
        </FixedLabel>
      </mesh>
      {rings && (
        <mesh 
          ref={ringsRef} 
          position={position} 
          rotation={[0.5, 0, 0]}
        >
          <ringGeometry args={[size * 1.4, size * 2.2, 64]} />
          <meshStandardMaterial
            map={new THREE.TextureLoader().load('celestial_pics/2k_saturn_ring_alpha.png')}
            transparent={true}
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </>
  );
}

// Sun component with enhanced glow
function Sun({ showLabels }) {
  const sunRef = useRef();
  const [hovered, setHovered] = useState(false);
  const sunSize = 4;
  const hoverSize = sunSize * 5;

  useFrame((state, delta) => {
    sunRef.current.rotation.y += 0.002;
  });

  return (
    <>
      {/* Invisible hover detection sphere */}
      <mesh 
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[hoverSize, 16, 16]} />
        <meshBasicMaterial visible={false} transparent={true} opacity={0} />
      </mesh>
      <mesh 
        ref={sunRef} 
        position={[0, 0, 0]}
      >
        <sphereGeometry args={[sunSize, 32, 32]} />
        <meshStandardMaterial
          map={new THREE.TextureLoader().load('celestial_pics/2k_sun.jpg')}
          emissiveMap={new THREE.TextureLoader().load('celestial_pics/2k_sun.jpg')}
          emissive="#ffffff"
          emissiveIntensity={3}
        />
        <pointLight intensity={2} distance={100} decay={1.5} />
        <FixedLabel 
          position={[0, sunSize * 1.5, 0]} 
          visible={hovered}
          showLabels={showLabels}
        >
          Sun
        </FixedLabel>
      </mesh>
    </>
  );
}

function SolarSystem({ showLabels, showOrbits }) {
  const scaleFactor = 0.3;
  const distanceUnit = 8;

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 0]} intensity={1.5} />
      <Sun showLabels={showLabels} />
      <Planet
        name="Mercury"
        position={[distanceUnit * 1, 0, 0]}
        size={0.383 * scaleFactor}
        textureUrl="celestial_pics/2k_mercury.jpg"
        orbitRadius={distanceUnit * 1}
        orbitSpeed={0.04 * (365/88)}
        rotationSpeed={0.01 * (365/59)}
        showLabels={showLabels}
        showOrbits={showOrbits}
      />
      <Planet
        name="Venus"
        position={[distanceUnit * 1.5, 0, 0]}
        size={0.949 * scaleFactor}
        textureUrl="celestial_pics/2k_venus.jpg"
        orbitRadius={distanceUnit * 1.5}
        orbitSpeed={0.04 * (365/225)}
        rotationSpeed={0.01 * (365/243)}
        showLabels={showLabels}
        showOrbits={showOrbits}
      />
      <Planet
        name="Earth"
        position={[distanceUnit * 2, 0, 0]}
        size={1 * scaleFactor}
        textureUrl="celestial_pics/2k_earth.jpg"
        orbitRadius={distanceUnit * 2}
        orbitSpeed={0.04}
        rotationSpeed={0.01}
        showLabels={showLabels}
        showOrbits={showOrbits}
      />
      <Planet
        name="Mars"
        position={[distanceUnit * 2.5, 0, 0]}
        size={0.532 * scaleFactor}
        textureUrl="celestial_pics/2k_mars.jpg"
        orbitRadius={distanceUnit * 2.5}
        orbitSpeed={0.04 * (365/687)}
        rotationSpeed={0.01 * (24/24.6)}
        showLabels={showLabels}
        showOrbits={showOrbits}
      />
      <Planet
        name="Jupiter"
        position={[distanceUnit * 3.5, 0, 0]}
        size={11.209 * scaleFactor * 0.3}
        textureUrl="celestial_pics/2k_jupiter.jpg"
        orbitRadius={distanceUnit * 3.5}
        orbitSpeed={0.04 * (365/4333)}
        rotationSpeed={0.01 * (24/10)}
        showLabels={showLabels}
        showOrbits={showOrbits}
      />
      <Planet
        name="Saturn"
        position={[distanceUnit * 4.5, 0, 0]}
        size={9.449 * scaleFactor * 0.3}
        textureUrl="celestial_pics/2k_saturn.jpg"
        orbitRadius={distanceUnit * 4.5}
        orbitSpeed={0.04 * (365/10759)}
        rotationSpeed={0.01 * (24/10.7)}
        rings={true}
        showLabels={showLabels}
        showOrbits={showOrbits}
      />
      <Planet
        name="Uranus"
        position={[distanceUnit * 5.5, 0, 0]}
        size={4.007 * scaleFactor * 0.3}
        textureUrl="celestial_pics/2k_uranus.jpg"
        orbitRadius={distanceUnit * 5.5}
        orbitSpeed={0.04 * (365/30687)}
        rotationSpeed={0.01 * (24/17.2)}
        showLabels={showLabels}
        showOrbits={showOrbits}
      />
      <Planet
        name="Neptune"
        position={[distanceUnit * 6.5, 0, 0]}
        size={3.883 * scaleFactor * 0.3}
        textureUrl="celestial_pics/2k_neptune.jpg"
        orbitRadius={distanceUnit * 6.5}
        orbitSpeed={0.04 * (365/60190)}
        rotationSpeed={0.01 * (24/16.1)}
        showLabels={showLabels}
        showOrbits={showOrbits}
      />
    </group>
  );
}

function App() {
  const controlsRef = useRef();
  const [touchCount, setTouchCount] = useState(0);
  const [modifierKeyPressed, setModifierKeyPressed] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);

  const resetCamera = () => {
    if (controlsRef.current) {
      const duration = 1000; // Animation duration in milliseconds
      const startPosition = controlsRef.current.object.position.clone();
      const startPolarAngle = controlsRef.current.getPolarAngle();
      const startAzimuthalAngle = controlsRef.current.getAzimuthalAngle();
      const targetPosition = new THREE.Vector3(0, 35, 60);
      const targetPolarAngle = Math.PI / 3;
      const targetAzimuthalAngle = 0;
      
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        // Interpolate position
        const newX = startPosition.x + (targetPosition.x - startPosition.x) * easeProgress;
        const newY = startPosition.y + (targetPosition.y - startPosition.y) * easeProgress;
        const newZ = startPosition.z + (targetPosition.z - startPosition.z) * easeProgress;
        controlsRef.current.object.position.set(newX, newY, newZ);
        
        // Interpolate angles
        const newPolarAngle = startPolarAngle + (targetPolarAngle - startPolarAngle) * easeProgress;
        const newAzimuthalAngle = startAzimuthalAngle + (targetAzimuthalAngle - startAzimuthalAngle) * easeProgress;
        controlsRef.current.setPolarAngle(newPolarAngle);
        controlsRef.current.setAzimuthalAngle(newAzimuthalAngle);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey) {
        setModifierKeyPressed(true);
      }
    };
  
    const handleKeyUp = (e) => {
      if (e.code === 'MetaLeft' || e.code === 'MetaRight') {
        setModifierKeyPressed(false);
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw', 
      height: '100vh', 
      background: '#000', 
      overflow: 'hidden',
      cursor: modifierKeyPressed ? 'move' : 'grab'
    }}>
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1000
      }}>
        <button
          onClick={resetCamera}
          style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={e => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
        >
          Reset Camera
        </button>
        <button
          onClick={() => setShowLabels(!showLabels)}
          style={{
            padding: '8px 16px',
            backgroundColor: showLabels ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={e => e.target.style.backgroundColor = showLabels ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}
        >
          {showLabels ? 'Hide Labels' : 'Show Labels'}
        </button>
        <button
          onClick={() => setShowOrbits(!showOrbits)}
          style={{
            padding: '8px 16px',
            backgroundColor: showOrbits ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={e => e.target.style.backgroundColor = showOrbits ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}
        >
          {showOrbits ? 'Hide Orbits' : 'Show Orbits'}
        </button>
      </div>
      <Canvas 
        style={{ width: '100vw', height: '100vh' }}
      >
        <PerspectiveCamera makeDefault position={[0, 35, 60]} fov={60} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <Stars
            radius={150}
            depth={50}
            count={8000}
            factor={6}
            saturation={1}
            fade={false}
            speed={1.5}
          />
          <SolarSystem showLabels={showLabels} showOrbits={showOrbits} />
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={0.7}
            panSpeed={0.5}
            rotateSpeed={0.4}
            minDistance={6}
            maxDistance={150}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 6}
            mouseButtons={{
              LEFT: modifierKeyPressed ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.ROTATE
            }}
            touches={{
              ONE: touchCount === 1 ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_ROTATE
            }}
            enableDamping={true}
            dampingFactor={0.05}
            screenSpacePanning={true}
            zoomToCursor={true}
          />
        </Suspense>
      </Canvas>
      <div style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        pointerEvents: 'none'
      }}>
        {navigator.platform.includes('Mac') ? 'Cmd' : 'Alt'} + click and drag for 3D rotation • Scroll to zoom
      </div>
    </div>
  );
}

export default App;
