import { useSpring, animated } from '@react-spring/three';
import { useCompoundBody, useCylinder } from '@react-three/cannon';
import {
  Cylinder,
  MeshDistortMaterial,
  MeshWobbleMaterial,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { react, useState, useEffect, useRef, useContext } from 'react';
import {
  Color,
  MathUtils,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Vector3,
} from 'three';
import { GameContext } from '../GameContext';
export default function Beam({ shoot }) {
  const [visible, setVisible] = useState(false);
  const [collision, setCollision] = useState(false);
  useEffect(() => {
    if (shoot) {
      setVisible(true);
    } else setVisible(false);
  }, [shoot]);

  const { fighter } = useContext(GameContext);

  const [fighterHp, setFighterHp] = fighter;
  useEffect(() => {
    console.log(collision);
    if (collision && visible) {
      setFighterHp((prev) => prev - 10);
    }
  }, [collision, visible]);
  const { scene } = useThree();
  let args = [10, 10, 2000];

  const [triBeam, triBeamApi] = useCompoundBody(() => ({
    shapes: [
      {
        type: 'Cylinder',
        args: args,
        position: [0, 0, 1030.8],
        rotation: [-Math.PI / 2, 0, 0],
      },
      {
        type: 'Cylinder',
        args: args,
        position: [473, 0, 900.5],
        rotation: [-Math.PI / 2, 0, Math.PI / 6],
      },
      {
        type: 'Cylinder',
        args: args,
        position: [-473, 0, 900.5],
        rotation: [-Math.PI / 2, 0, -Math.PI / 6],
      },
    ],
    // rotation: [Math.PI / 2, 0, 0],
    position: scene.getObjectByName('Boss').position,
    type: 'Static',

    onCollideBegin: (e) => {
      const name = e.body?.userData?.name;
      if (name === 'Fighter') {
        setCollision(true);
      }
    },
    onCollideEnd: (e) => {
      const name = e.body?.userData?.name;
      if (name === 'Fighter') {
        setCollision(false);
      }
    },
    userData: {
      name: 'Beam',
      type: 'BossWeapon',

      damage: 10,
    },

    collisionResponse: false,
  }));

  useFrame(() => {
    const Boss = scene.getObjectByName('Boss');
    triBeamApi.position.copy(Boss.position);
    triBeamApi.rotation.copy(Boss.rotation);
  });

  return (
    <group
      visible={visible}
      position={[0, 0, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <Cylinder
        scale={[1, 1, 1]}
        args={[0.1, 0.1, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 10.8]}
      >
        <meshPhongMaterial
          emissive={'#FFF01F'}
          emissiveIntensity={1}
          color={'#FFF01F'}
        />
      </Cylinder>
      <Cylinder
        scale={[1, 1, 1]}
        args={[0.1, 0.1, 20]}
        rotation={[-Math.PI / 2, 0, Math.PI / 6]}
        position={[5, 0, 9.5]}
      >
        <meshPhongMaterial
          emissive={'#FFF01F'}
          emissiveIntensity={1}
          color={'#FFF01F'}
        />
      </Cylinder>
      <Cylinder
        scale={[1, 1, 1]}
        args={[0.1, 0.1, 20]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 6]}
        position={[-5, 0, 9.5]}
      >
        <meshPhongMaterial
          emissive={'#FFF01F'}
          emissiveIntensity={1}
          color={'#FFF01F'}
        />
      </Cylinder>
    </group>
  );
}
