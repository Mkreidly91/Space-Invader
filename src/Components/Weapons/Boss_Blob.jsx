import {
  MeshDistortMaterial,
  Sphere,
  MeshWobbleMaterial,
} from '@react-three/drei';
import { useState } from 'react';

export default function Boss_Blob(props) {
  return (
    <Sphere args={[30, 30, 30]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color={'red'}
        speed={2}
        distort={0.7}
        factor={1}
        radius={1}
      />
    </Sphere>
  );
}
