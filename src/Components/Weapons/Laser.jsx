import { useCylinder } from '@react-three/cannon';
import { Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useState, useRef } from 'react';
export default function Laser() {
  const [ref, api] = useCylinder(() => ({
    args: [3, 3, 30],
    rotation: [Math.PI / 2, 0, 0],
    onCollide: (e) => {},
  }));
  const SPEED = 100;
  const dy = -1;
  useFrame(() => {
    api.velocity.set(0, 0, -SPEED);
  });
  return (
    <Cylinder
      ref={ref}
      userData={{ name: 'Laser', type: 'weapon' }}
      args={[3, 3, 30]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <meshBasicMaterial color={'Red'} />
    </Cylinder>
  );
}
