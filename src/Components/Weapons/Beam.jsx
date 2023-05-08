import { useSpring, animated } from '@react-spring/three';
import { useCylinder } from '@react-three/cannon';
import { Cylinder } from '@react-three/drei';
import { react, useState, useEffect } from 'react';

export default function Beam() {
  const [ref, api] = useCylinder(() => ({
    type: 'Static',
    args: [10, 10, 500],
    position: [0, 0, 350],
    rotation: [-Math.PI / 2, 0, 0],
    userData: { name: 'Beam', type: 'BossWeapon' },
    onCollideBegin: (e) => {
      console.log(e.body.userData.name);
    },
  }));
  return (
    <Cylinder name="Beam" args={[10, 10, 500]} ref={ref}>
      <meshStandardMaterial
        metalness={1}
        roughness={1}
        emissive={'blue'}
        // color={'red'}
      />
    </Cylinder>
  );
}
