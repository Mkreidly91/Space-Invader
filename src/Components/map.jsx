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
    userData: { type: 'boundary', name: 'Top' },
  }));
  const [bottom] = useBox(() => ({
    type: 'Static',
    position: [0, 0, getCurrentViewport().height / 2],
    args: [getCurrentViewport().width, 50, 50],
    userData: { type: 'boundary', name: 'Bottom' },
  }));
  const [left] = useBox(() => ({
    type: 'Static',
    position: [-getCurrentViewport().width / 2, 0, 0],
    args: [50, 50, getCurrentViewport().height],
    userData: { type: 'boundary', name: 'Left' },
  }));
  const [right] = useBox(() => ({
    type: 'Static',
    position: [getCurrentViewport().width / 2, 0, 0],
    args: [50, 50, getCurrentViewport().height],
    userData: { type: 'boundary', name: 'Right' },
  }));

  return (
    <group position={[0, 0, 0]}>
      <Box ref={top} name="Top" args={[width, 50, 50]} visible={true}>
        <meshStandardMaterial color="red" />
      </Box>
      <Box name={'Bottom'} ref={bottom} args={[width, 50, 50]} visible={true}>
        <meshStandardMaterial color="blue" />
      </Box>
      <Box ref={left} args={[50, 50, height]} color={'blue'} visible={true} />
      <Box ref={right} args={[50, 50, height]} color={'blue'} visible={true} />
    </group>
  );
}
