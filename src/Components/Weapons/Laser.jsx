import { useCylinder } from '@react-three/cannon';
import { Cylinder } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState, useRef } from 'react';
import { MathUtils } from 'three';

export default function Laser({ fighterPosition, rotation, cleanUp }) {
  const { scene } = useThree();
  const fighterPos = scene.getObjectByName('Fighter').position;

  const [position, setPosition] = useState(fighterPos);
  const [collision, setCollision] = useState(false);
  const [ref, api] = useCylinder(() => ({
    type: 'Dynamic',
    args: [3, 3, 30],
    position: [position],
    mass: 1,
    rotation: [Math.PI / 2, 0, 0],
    onCollide: (e) => {
      if (e.body?.userData.type === 'boundary') {
        setCollision(true);
      }
    },
    collisionFilterGroup: 2,

    collisionResponse: 0,
  }));
  const SPEED = -10;

  useFrame(() => {
    const [x, y, z] = position;
    if (!collision) {
      setPosition([x, y, z + SPEED]);

      api.position.set(x, y, z + SPEED);
    } else {
      api.velocity.set(0, 0, 0);
      cleanUp(ref.current.uuid);
    }
  });
  return (
    <Cylinder
      position={position}
      ref={ref}
      userData={{ name: 'Laser', type: 'weapon' }}
      args={[3, 3, 30]}
    >
      <meshBasicMaterial color={'Red'} />
    </Cylinder>
  );
}
