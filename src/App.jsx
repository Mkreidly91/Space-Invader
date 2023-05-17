import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import Fighter from './Components/Fighter';
import './App.css';
import { Suspense, useContext, useEffect, useRef, useState } from 'react';

import { Map } from './Components/map';
import { Physics } from '@react-three/cannon';

import KrakenEye from './Components/KrakenEye';

import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import { GameContext } from './Components/GameContext';

function App() {
  const app = useRef();
  const { gameOver } = useContext(GameContext);
  return (
    <div ref={app} className="App">
      <Canvas
        className="canvas"
        style={{ background: 'black', width: '100%', height: '100%' }}
      >
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
        {/* <GameOverText /> */}
        <Physics gravity={[0, 0, 0]}>
          <Map />
          {!gameOver && (
            <Suspense>
              <Fighter />
              <KrakenEye />
            </Suspense>
          )}
        </Physics>
      </Canvas>
    </div>
  );
}

export default App;
