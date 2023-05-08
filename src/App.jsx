import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import Fighter from './Components/Fighter';
import './App.css';
import { Suspense, useEffect, useRef, useState } from 'react';
import { CameraHelper } from 'three';
import { Map } from './Components/map';
import { Physics } from '@react-three/cannon';
import Laser from './Components/Weapons/Laser';
import Gun from './Components/Weapons/Gun';
import Boss from './Components/Boss';
import Boss_Blob from './Components/Weapons/Boss_Blob';
import Boss2 from './Components/Boss2';
import KrakenEye from './Components/KrakenEye';
function App() {
  const app = useRef();

  return (
    <div ref={app} className="App">
      <Canvas className="canvas" style={{ background: 'white' }}>
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
            <Fighter />
            <Gun />
            {/* <Boss_Blob /> */}
            {/* <Boss2 /> */}
            <KrakenEye />
          </Suspense>
        </Physics>
      </Canvas>
    </div>
  );
}

export default App;
