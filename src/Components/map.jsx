import { useBox } from '@react-three/cannon';
import { Box } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export function Map() {
  const { viewport, scene, camera } = useThree();

  const { width, height, getCurrentViewport } = viewport;

  const [top] = useBox(() => ({
    type: 'Static',
    position: [0, 0, -getCurrentViewport().height / 2],
    args: [getCurrentViewport().width, 50, 50],
  }));
  const [bottom] = useBox(() => ({
    type: 'Static',
    position: [0, 0, getCurrentViewport().height / 2],
    args: [getCurrentViewport().width, 50, 50],
  }));
  const [left] = useBox(() => ({
    type: 'Static',
    position: [-getCurrentViewport().width / 2, 0, 0],
    args: [50, 50, getCurrentViewport().height],
  }));
  const [right] = useBox(() => ({
    type: 'Static',
    position: [getCurrentViewport().width / 2, 0, 0],
    args: [50, 50, getCurrentViewport().height],
  }));

  return (
    <group position={[0, 0, 0]}>
      <Box
        ref={top}
        name="Top"
        args={[width, 50, 50]}
        position={[0, 0, -height / 2]}
        visible={true}
        userData={{ type: 'boundary' }}
      >
        <meshStandardMaterial color="red" />
      </Box>
      <Box
        name={'Bottom'}
        ref={bottom}
        position={[0, 0, height / 2]}
        args={[width, 50, 50]}
        visible={true}
        userData={{ type: 'boundary' }}
      >
        <meshStandardMaterial color="blue" />
      </Box>
      <Box
        ref={left}
        name={'Left'}
        position={[-width / 2, 0, 0]}
        args={[50, 50, height]}
        color={'blue'}
        visible={true}
        userData={{ type: 'boundary' }}
      />
      <Box
        ref={right}
        name={'Right'}
        position={[width / 2, 0, 0]}
        args={[50, 50, height]}
        color={'blue'}
        visible={true}
        userData={{ type: 'boundary' }}
      />
    </group>
  );
}
