import { Html } from '@react-three/drei';
import { useState, useEffect, useContext } from 'react';
import { GameContext } from './GameContext';
export default function FighterHp({
  position: [fighter_X, fighter_Y, fighter_Z],
}) {
  const {
    fighter: [fighterHp],
  } = useContext(GameContext);
  return (
    <Html
      position={[-300, 0, 300]}
      as="div"
      scale={1}
      style={{
        width: '100px',
        height: '10px',
        backgroundColor: 'transparent',
        border: '2px solid green',
      }}
    >
      <div
        style={{
          backgroundColor: 'green',
          height: '100%',
          width: `${fighterHp > 0 ? fighterHp : 0}%`,
        }}
      ></div>
    </Html>
  );
}
