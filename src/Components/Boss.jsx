import { react, useEffect, useRef, useState } from 'react';
import { Box, Sphere, useAnimations, useGLTF } from '@react-three/drei';
import { useBox, useSphere } from '@react-three/cannon';
import { Color, MathUtils, Vector3 } from 'three';
import { act, useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';

import Beam from './Weapons/Beam';
const COLOR_BLUE = new Color(0, 0, 255);
const COLOR_RED = new Color(255, 0, 0);
const COLOR_WHITE = new Color(255, 255, 255);

export default function Boss(props) {
  const group = useRef();
  const { scene } = useThree();
  const { nodes, materials, animations } = useGLTF(
    '/3dModels/scifi_drone_1.1.glb'
  );

  const { actions } = useAnimations(animations, group);
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
      const d = Math.sin(t) * 500;
      bossRef.current.position.lerp(new Vector3(x, d, bossPos[2]), 0.05);
      setPosition(bossRef.current.position.toArray());
      api.position.copy(bossPosition);
    }
  };
  useEffect(() => {
    actions['Armature|Attack '].play();
    actions['Armature|Attack '].halt(0);
    //  actions['Armature|idle'].play();
  }, []);

  materials['Scene_-_Root'].color = new Color(0, 0, 255);

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
      if (collision) {
        materials['Scene_-_Root'].color = COLOR_RED;
        setTimeout(() => {
          materials['Scene_-_Root'].color = COLOR_BLUE;
          setCollision(false);
        }, 100);
      }
      bossMovement(group, api, clock);
    }

    group.current.lookAt(scene.getObjectByName('Fighter').position);
  });

  return (
    <animated.group
      dispose={null}
      ref={group}
      scale={scale}
      //   visible={hp > 0 ? true : false}
      position={pos}
      name="Boss"
    >
      <Beam />
      {/* <Sphere args={[110, 110, 110]} ref={ref} /> */}
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="ebcbc3a451314629b1cdd867891e3979fbx"
            rotation={[Math.PI / 2, 0, 0]}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group
                  name="Armature"
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={100}
                >
                  <group name="Object_5">
                    <primitive object={nodes._rootJoint} />
                    <group name="Object_51" />
                    <skinnedMesh
                      name="Object_52"
                      geometry={nodes.Object_52.geometry}
                      material={materials['Scene_-_Root']}
                      skeleton={nodes.Object_52.skeleton}
                    />
                  </group>
                </group>
                <group name="Sphere" />
              </group>
            </group>
          </group>
        </group>
      </group>
    </animated.group>
  );
}

useGLTF.preload('/3dModels/scifi_drone_1.1.glb');
// <Box
//   args={[100, 100, 100]}
//   ref={ref}
//   visible={hp > 0 ? true : false}
//   userData={{ name: 'Box_Boss', type: 'enemy' }}
// >
//   <meshStandardMaterial color={'red'} />
// </Box>
