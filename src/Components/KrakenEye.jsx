import { react, useEffect, useRef, useState } from 'react';
import { Box, Sphere, useAnimations, useGLTF } from '@react-three/drei';
import { useBox, useSphere } from '@react-three/cannon';
import { Color, MathUtils, Vector3 } from 'three';
import { act, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';

import Beam from './Weapons/Beam';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useMemo } from 'react';

export default function KrakenEye(props) {
  const group = useRef();
  const { scene } = useThree();
  const gltf = useMemo(() => useGLTF('/3dModels/kraken_eyeball.glb'), []);
  // const gltf = useLoader(GLTFLoader, '/3dModels/kraken_eyeball.glb');
  const [hp, setHp] = useState(100);
  const [position, setPosition] = useState([0, 0, -300]);
  const [collision, setCollision] = useState(false);

  const { pos } = useSpring({
    pos: position,
  });

  const bossMovement = (bossRef, api, clock) => {
    if (bossRef.current) {
      const [x, y, z] = scene.getObjectByName('Fighter').position.toArray();
      const bossPos = bossRef.current.position.toArray();

      let distance = 100;

      const bossPosition = bossRef.current.position;

      const t = clock.getElapsedTime(); // Get the elapsed time since the start of the application
      const d = Math.sin(t / 2) * 500;
      bossRef.current.position.lerp(new Vector3(x, d, bossPos[2]), 0.005);
      setPosition(bossRef.current.position.toArray());
      api.position.copy(bossPosition);
    }
  };

  const { scale } = useSpring({
    scale: collision ? 1000 : 900,
  });
  useEffect(() => {
    group.current.scale.set(0);
  }, []);

  const [ref, api] = useSphere(() => ({
    type: 'Dynamic',
    mass: 1,
    args: [110, 110, 110],
    position: position,
    userData: { type: 'enemy' },

    onCollideBegin: (e) => {
      const type = e.body.userData.type;
      if (type === 'weapon') {
        setHp((prev) => prev - 10);

        setCollision(true);
      }
    },

    onCollideEnd: (e) => {
      if (e.body.userData.type === 'weapon') {
        setCollision(false);
      }
    },
    //collisionFilterGroup: 2,
  }));

  useFrame(({ clock }) => {
    if (group.current) {
      bossMovement(group, api, clock);
    }
    if (collision) {
      setTimeout(() => {
        setCollision(false);
      }, 2);
    }
    group.current.lookAt(scene.getObjectByName('Fighter').position);
  });

  return (
    // <animated.group
    //   ref={group}
    //   scale={scale}
    //   position={pos}
    //   {...props}
    //   dispose={null}
    // >
    //   <group rotation={[-Math.PI / 2, 0, 0]}>
    //     <group rotation={[Math.PI / 2, 0, 0]}>
    //       <mesh
    //         castShadow
    //         receiveShadow
    //         geometry={nodes.Object_6.geometry}
    //         material={materials['KRAKEN.004']}
    //         scale={1}
    //       />
    //       <mesh
    //         geometry={nodes.Object_4.geometry}
    //         material={materials['KRAKEN-EYE']}
    //       />
    //     </group>
    //   </group>
    // </animated.group>

    <animated.primitive
      scale={scale}
      position={pos}
      ref={group}
      object={gltf.scene}
    />
  );
}

useGLTF.preload('/3dModels/kraken_eyeball.glb');
