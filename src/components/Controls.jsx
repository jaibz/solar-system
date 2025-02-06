import { useThree } from '@react-three/fiber'

const Controls = ({ showOrbits, setShowOrbits, showLabels, setShowLabels }) => {
  const { camera } = useThree()

  const resetCamera = () => {
    camera.position.set(0, 30, 50)
    camera.lookAt(0, 0, 0)
  }

  return (
    <div className="controls">
      <button onClick={() => setShowOrbits(!showOrbits)}>
        {showOrbits ? 'Hide' : 'Show'} Orbits
      </button>
      <button onClick={() => setShowLabels(!showLabels)}>
        {showLabels ? 'Hide' : 'Show'} Labels
      </button>
      <button onClick={resetCamera}>Reset Camera</button>
    </div>
  )
}

export default Controls 