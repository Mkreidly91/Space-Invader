import { react, useEffect, useRef, useState, useContext, useMemo } from 'react';
import {
  Box,
  Cylinder,
  Sphere,
  Text,
  useAnimations,
  useGLTF,
} from '@react-three/drei';
import { useBox, useSphere } from '@react-three/cannon';
import { Color, MathUtils, Quaternion, Vector3 } from 'three';
import { act, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import BossHp from './BossHp';
import Beam from './Weapons/Beam';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import MagmaSpawner from './Weapons/MagmaSpawner';
import { GameContext } from './GameContext';

export default function KrakenEye(props) {
  const group = useRef();
  const { scene } = useThree();
  const { nodes, materials } = useMemo(
    () => useGLTF('/3dModels/kraken_eyeball.glb'),
    []
  );

  const red = new Color(101, 28, 50);
  const yellow = new Color(255, 250, 31);
  materials['KRAKEN-EYE'].color = red;
  materials['KRAKEN-EYE'].emissive = red;

  // const gltf = useLoader(GLTFLoader, '/3dModels/kraken_eyeball.glb');
  const [hp, setHp] = useState(1000);
  const [position, setPosition] = useState([0, 0, -300]);
  const [scale, setScale] = useState(100);
  const [shoot, setShoot] = useState(false);

  const { setGameOver } = useContext(GameContext);
  useEffect(() => {
    if (hp <= 0) {
      setGameOver(true);
    }
  }, [hp]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!shoot) {
        setShoot(true);
        setTimeout(() => setShoot(false), 5000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [shoot]);

  const { pos, springScale } = useSpring({
    pos: position,
    springScale: scale,
  });

  const bossMovement = ({ boss, api, clock, fighterPosition, shoot }) => {
    const { x, y, z } = scene.getObjectByName('Fighter').position;

    const bossPosition = boss.position;

    const t = clock.getElapsedTime(); // Get the elapsed time since the start of the application
    const d = Math.sin(t) * 200;
    if (!shoot) {
      boss.position.lerp(new Vector3(x, 0, bossPosition.z), 0.001);
      setPosition(bossPosition.toArray());
      api.position.copy(bossPosition);
    }

    //Boss rotation
    const clone = boss.clone();
    clone.lookAt(fighterPosition);
    const q = new Quaternion().copy(clone.quaternion);
    if (shoot) {
      boss.quaternion.slerp(q, 0.01);
    } else {
      boss.quaternion.slerp(q, 0.05);
    }
  };

  const [ref, api] = useSphere(() => ({
    type: 'Dynamic',
    mass: 1,
    args: [110, 110, 110],
    position: position,

    userData: { type: 'Boss' },

    onCollideBegin: (e) => {
      const type = e.body?.userData?.type;

      if (type === 'weapon') {
        setHp((prev) => prev - 10);
      }
    },
    collisionResponse: false,
  }));

  useFrame(({ clock }) => {
    if (group.current) {
      const fighterPosition = scene.getObjectByName('Fighter').position;
      bossMovement({ boss: group.current, api, clock, fighterPosition, shoot });

      materials['KRAKEN-EYE'].emissiveIntensity = Math.sin(
        clock.getElapsedTime() / 2
      );
    }
  });

  const [boss_X, boss_Y, boss_Z] = position;
  return (
    <>
      <BossHp position={position} health={hp} />

      <MagmaSpawner />
      <animated.group
        ref={group}
        scale={scale}
        position={position}
        {...props}
        dispose={null}
        name={'Boss'}
      >
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_6.geometry}
              material={materials['KRAKEN.004']}
              scale={1}
            />
            <mesh
              geometry={nodes.Object_4.geometry}
              material={materials['KRAKEN-EYE']}
            />
          </group>

          <Beam shoot={shoot} />
        </group>
      </animated.group>
    </>
  );
}

useGLTF.preload('/3dModels/kraken_eyeball.glb');
