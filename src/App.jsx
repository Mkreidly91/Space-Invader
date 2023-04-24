import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import Fighter from './Components/Fighter';
import './App.css';
import { Suspense, useEffect, useRef } from 'react';
import { CameraHelper } from 'three';
import { Map } from './Components/map';
import { Physics } from '@react-three/cannon';
import Laser from './Components/Weapons/Laser';

function App() {
  const app = useRef();
  useEffect(() => {
    console.log(app.current.offsetWidth);
  });
  return (
    <div ref={app} className="App">
      <Canvas className="canvas" style={{ background: 'black' }}>
        <ambientLight intensity={0.5} />
        <OrbitControls />
        <PerspectiveCamera
          makeDefault
          position={[0, 1000, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <Stars
          radius={500}
          depth={0}
          count2={20000}
          factor={20}
          saturation={0}
          fade={false}
          speed={0.2}
        />
        <Physics gravity={[0, 0, 0]}>
          <Map />
          <Suspense>
            <Laser />
            <Fighter />
          </Suspense>
        </Physics>
      </Canvas>
    </div>
  );
}

export default App;
