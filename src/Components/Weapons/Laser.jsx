import { useSpring, animated } from '@react-spring/three';
import { useCylinder } from '@react-three/cannon';
import { Cylinder } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState, useRef, useEffect, useMemo } from 'react';
import { BufferGeometry, CylinderGeometry, MathUtils } from 'three';

const SPEED = -10;

export default function Laser({ cleanUp, id }) {
  const { scene } = useThree();
  const sound = useMemo(() => new Audio('/audio/laser.mp3'), []);
  sound.volume = 0.5;
  const fighterPos = scene.getObjectByName('Fighter').position;

  const [position, setPosition] = useState(fighterPos);

  const [collision, setCollision] = useState(false);

  const [ref, api] = useCylinder(() => ({
    type: 'Dynamic',
    args: [3, 3, 30],
    position: position,
    mass: 1,
    rotation: [Math.PI / 2, 0, 0],
    onCollideBegin: (e) => {
      const type = e.body?.userData?.type;

      if (type === 'boundary' || type === 'Boss') {
        cleanUp(id);
        setCollision(true);
      }
    },

    collisionFilterGroup: 2,

    collisionResponse: 0,
  }));
  useEffect(() => {
    sound.play();
  }, []);
  useFrame((state, delta) => {
    const [x, y, z] = position;
    if (!collision) {
      setPosition([x, y, z + SPEED]);
      api.position.set(x, y, z + SPEED);
    }
  });

  return (
    <Cylinder
      ref={ref}
      userData={{ name: 'Laser', type: 'weapon' }}
      args={[3, 3, 30]}
    >
      <meshBasicMaterial color={'cyan'} />
    </Cylinder>
  );
}
