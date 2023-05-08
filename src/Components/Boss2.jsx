import { react, useEffect, useRef, useState } from 'react';
import { Box, Sphere, useAnimations, useGLTF } from '@react-three/drei';
import { useBox, useSphere } from '@react-three/cannon';
import { Color, MathUtils, Vector3 } from 'three';
import { act, useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';

import Beam from './Weapons/Beam';

export default function Boss2(props) {
  const group = useRef();
  const { scene } = useThree();
  const { nodes, materials } = useGLTF('/3dModels/mecanic_eye.glb');
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
      const d = Math.sin(t / 2) * 200;
      bossRef.current.position.lerp(new Vector3(x, d, bossPos[2]), 0.005);
      setPosition(bossRef.current.position.toArray());
      api.position.copy(bossPosition);
    }
  };

  const { scale } = useSpring({
    scale: collision ? 1.05 : 1,
  });

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

    group.current.lookAt(scene.getObjectByName('Fighter').position);
  });

  return (
    <animated.group
      ref={group}
      position={position}
      scale={100}
      {...props}
      dispose={null}
    >
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_2.geometry}
          material={materials.OjoInterior}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          material={materials.Helmet}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_3.geometry}
          material={materials.OjosExterior}
        />
      </group>
    </animated.group>
  );
}

useGLTF.preload('/3dModels/mecanic_eye.glb');
// <Box
//   args={[100, 100, 100]}
//   ref={ref}
//   visible={hp > 0 ? true : false}
//   userData={{ name: 'Box_Boss', type: 'enemy' }}
// >
//   <meshStandardMaterial color={'red'} />
// </Box>
