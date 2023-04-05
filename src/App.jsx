import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Fighter from './Components/Fighter';
import './App.css';
import { Suspense } from 'react';

function App() {
  return (
    <div className="App">
      <Canvas className="canvas">
        <ambientLight intensity={0.5} />
        <Suspense>
          <Fighter />
        </Suspense>

        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
