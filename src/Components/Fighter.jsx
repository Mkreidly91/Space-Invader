/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Cinnamine3D (https://sketchfab.com/LordCinn)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/pixel-plane-da5c802719844a86b9464f73c633cdd1
title: PIXEL PLANE
*/

import React, { useEffect, useRef, useState, useReducer } from 'react';
import { useGLTF, useAnimations, Sphere, Box } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { useFrame } from '@react-three/fiber';
import { useBox, useSphere } from '@react-three/cannon';

const initialMovementState = {
  rotate_L: false,
  rotate_R: false,
  move_U: true,
  move_D: true,
  move_L: true,
  move_R: true,
  shoot: false,
};

function movementReducer(state, action) {
  switch (action.type) {
    case 'rotate_L':
      return { ...state, rotate_L: true, rotate_R: false };
    case 'rotate_R':
      return { ...state, rotate_R: true, rotate_L: false };
    case 'move_U_ON':
      return { ...state, move_U: true };
    case 'move_D_ON':
      return { ...state, move_D: true };
    case 'move_L_ON':
      return { ...state, move_L: true };
    case 'move_R_ON':
      return { ...state, move_R: true };
    case 'move_U_OFF':
      return { ...state, move_U: false };
    case 'move_D_OFF':
      return { ...state, move_D: false };
    case 'move_L_OFF':
      return { ...state, move_L: false };
    case 'move_R_OFF':
      return { ...state, move_R: false };

    case 'resetRotation': {
      return {
        ...state,
        rotate_L: false,
        rotate_R: false,
      };
    }
    case 'resetMovement':
      return {
        ...state,
        move_U: true,
        move_D: true,
        move_L: true,
        move_R: true,
      };
    case 'shoot':

    case 'default':
      throw new Error('No such case exists');
  }
}

export default function Fighter(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/3dModels/pixel_plane.glb');
  const { actions } = useAnimations(animations, group);
  const ROTATION_C = 0.5;
  const MOVEMENT_C = 10;
  const [fighterPos, setFighterPos] = useState([0, 0, 0]);
  const { setPos } = props;
  const [keys, setKeys] = useState({});

  const [moveState, moveDispatch] = useReducer(
    movementReducer,
    initialMovementState
  );

  const { rotate_L, rotate_R, move_U, move_D, move_L, move_R } = moveState;

  const { rotation, position } = useSpring({
    rotation: rotate_R
      ? [Math.PI / 2, -ROTATION_C, 0]
      : rotate_L
      ? [Math.PI / 2, ROTATION_C, 0]
      : [Math.PI / 2, 0, 0],
    position: fighterPos,
  });

  const [body, api] = useSphere(() => ({
    // create a dynamic body with a sphere shape and set its radius
    type: 'Dynamic',
    mass: 1,
    position: position.get(),
    rotation: [Math.PI / 2, 0, 0],
    args: [60, 60, 60],

    onCollide: (e) => {
      console.log(`collided with ${e.body.userData.type}`);
      if (e.body?.userData.type === 'boundary') {
        const [x, y, z] = e.contact.contactNormal;

        if (x) {
          if (x < 0) moveDispatch({ type: 'move_R_OFF' });
          else if (x > 0) moveDispatch({ type: 'move_L_OFF' });
        }
        if (z) {
          if (z < 0) moveDispatch({ type: 'move_D_OFF' });
          else if (z > 0) moveDispatch({ type: 'move_U_OFF' });
        }
      }
    },
    collisionFilterGroup: 2,
    collisionResponse: false,

    onCollideEnd: (e) => {
      console.log(`ended collision with ${e.body.userData.type}`);
      if (e.body?.userData?.type === 'boundary') {
        const { name } = e.body;
        switch (name) {
          case 'Top':
            moveDispatch({ type: 'move_U_ON' });
            break;
          case 'Bottom':
            moveDispatch({ type: 'move_D_ON' });
            break;
          case 'Left':
            moveDispatch({ type: 'move_L_ON' });
            break;
          case 'Right':
            moveDispatch({ type: 'move_R_ON' });
            break;
        }
      }
    },
  }));

  useFrame(({ clock }) => {
    // Get current position of the ship
    const [x, y, z] = fighterPos;

    // Move the ship based on user input
    let dx = 0,
      dz = 0;
    if (!keys.a && !keys.d) {
      moveDispatch({ type: 'resetRotation' });
    }
    if (keys.a) {
      dx = move_L ? -1 : 0;
      moveDispatch({ type: 'rotate_L' });
    }
    if (keys.d) {
      moveDispatch({ type: 'rotate_R' });
      dx = move_R ? 1 : 0;
    }
    if (keys.w) dz = move_U ? -1 : 0;
    if (keys.s) dz = move_D ? 1 : 0;
    if (dx !== 0 || dz !== 0) {
      const length = Math.sqrt(dx * dx + dz * dz);

      setFighterPos([
        x + (MOVEMENT_C * dx) / length,
        y,
        z + (MOVEMENT_C * dz) / length,
      ]);
      api.position.set(
        x + (MOVEMENT_C * dx) / length,
        y,
        z + (MOVEMENT_C * dz) / length + 30
      );
    }
  });
  useEffect(() => {
    actions['ArmatureAction.001'].play();
    if (group.current) {
      const keyDownFunction = (event) => {
        const { key } = event;
        setKeys((prev) => {
          return { ...prev, [key]: true };
        });
      };

      const keyUpFunction = (event) => {
        event.preventDefault();
        const { key } = event;

        setKeys((prev) => {
          const newObj = { ...prev };
          if (newObj[key]) delete newObj[key];
          return newObj;
        });
      };

      const keyDownListener = document.addEventListener(
        'keydown',
        keyDownFunction
      );
      const keyUpListener = document.addEventListener('keyup', keyUpFunction);

      return () => {
        document.removeEventListener(keyUpListener, keyUpFunction);
        document.removeEventListener(keyDownListener, keyDownFunction);
      };
    }
  }, [group.current, position, moveState]);

  return (
    <animated.group
      ref={group}
      dispose={null}
      {...props}
      scale={5}
      rotation={rotation}
      position={position}
      name="Fighter"
    >
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model">
          <group
            name="851ef2b194494e539ad187404fbe584bfbx"
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group name="Armature" rotation={[-Math.PI / 2, 0, 0]}>
                  <group name="Object_6">
                    <primitive object={nodes._rootJoint} />
                    <group name="Object_8" rotation={[-Math.PI / 2, 0, 0]} />

                    <skinnedMesh
                      name="Object_9"
                      geometry={nodes.Object_9.geometry}
                      material={materials['Material.026']}
                      skeleton={nodes.Object_9.skeleton}
                    />
                  </group>
                </group>
                <group name="Cube000" rotation={[-Math.PI / 2, 0, 0]} />
              </group>
            </group>
          </group>
        </group>
      </group>
    </animated.group>
  );
}

useGLTF.preload('/3dModels/pixel_plane.glb');
