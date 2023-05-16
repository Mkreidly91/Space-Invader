import { Html } from '@react-three/drei';
import { useState, useEffect } from 'react';

export default function BossHp({ position: [boss_X, boss_Y, boss_Z], health }) {
  return (
    <Html
      position={[boss_X + 125, boss_Y, boss_Z - 75]}
      as="div"
      scale={1}
      style={{
        width: '10px',
        height: '100px',
        backgroundColor: 'transparent',
        border: '2px solid red',
      }}
    >
      <div
        style={{
          backgroundColor: 'red',
          width: '100%',
          height: `${health / 10}%`,
        }}
      ></div>
    </Html>
  );
}
