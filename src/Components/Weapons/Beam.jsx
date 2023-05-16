import { useSpring, animated } from '@react-spring/three';
import { useCylinder } from '@react-three/cannon';
import {
  Cylinder,
  MeshDistortMaterial,
  MeshWobbleMaterial,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { react, useState, useEffect } from 'react';
import { Color, MathUtils, MeshStandardMaterial, Vector3 } from 'three';

export default function Beam({ shoot }) {
  const [collisionResponse, setCollisionResponse] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setCollisionResponse(true);
    }, 1000);
  }, []);

  const [ref, api] = useCylinder(() => ({
    type: 'Static',
    args: [0.1, 0.1, 20],
    position: [0, 0, 10.8],
    rotation: [-Math.PI / 2, 0, 0],
    userData: { name: 'Beam', type: 'BossWeapon', damage: 10 },
    collisionResponse: collisionResponse,
    onCollideBegin: (e) => {},
  }));
  const [beamR, beamR_API] = useCylinder(() => ({
    type: 'Static',
    args: [0.1, 0.1, 20],
    position: [5, 0, 9.5],
    rotation: [-Math.PI / 2, 0, Math.PI / 6],
    userData: { name: 'Beam', type: 'BossWeapon', damage: 10 },
    collisionResponse: collisionResponse,
    onCollideBegin: (e) => {},
  }));
  const [beamL, beamL_API] = useCylinder(() => ({
    type: 'Static',
    args: [0.1, 0.1, 20],
    position: [-5, 0, 9.5],
    rotation: [-Math.PI / 2, 0, -Math.PI / 6],
    userData: { name: 'Beam', type: 'BossWeapon', damage: 10 },
    collisionResponse: collisionResponse,
    onCollideBegin: (e) => {},
  }));

  useFrame(() => {
    ref.current.scale.lerp(new Vector3(1, 1, 1), 0.03);
    beamL.current.scale.lerp(new Vector3(1, 1, 1), 0.03);
    beamR.current.scale.lerp(new Vector3(1, 1, 1), 0.03);
  });
  return (
    <>
      <Cylinder scale={[0, 1, 1]} name="Beam" args={[0.05, 0.05, 20]} ref={ref}>
        <meshPhongMaterial
          emissive={'#FFF01F'}
          emissiveIntensity={1}
          color={'#FFF01F'}
          transparent={true}
          reflectivity={1}
        />
      </Cylinder>
      <Cylinder
        scale={[0, 1, 1]}
        name="Beam"
        args={[0.05, 0.05, 20]}
        ref={beamR}
      >
        <meshPhongMaterial
          emissive={'#FFF01F'}
          emissiveIntensity={1}
          color={'#FFF01F'}
          transparent={true}
          reflectivity={1}
        />
      </Cylinder>
      <Cylinder
        scale={[0, 1, 1]}
        name="Beam"
        args={[0.05, 0.05, 20]}
        ref={beamL}
      >
        <meshPhongMaterial
          emissive={'#FFF01F'}
          emissiveIntensity={1}
          color={'#FFF01F'}
          transparent={true}
          reflectivity={1}
        />
      </Cylinder>
    </>
  );
}
