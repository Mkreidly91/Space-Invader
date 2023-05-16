import { useSpring, animated } from '@react-spring/three';
import { useSphere } from '@react-three/cannon';
import {
  MeshDistortMaterial,
  Sphere,
  MeshWobbleMaterial,
  useTexture,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { MeshStandardMaterial, Quaternion, Vector3 } from 'three';

const AnimatedSphere = animated(Sphere);

export default function MagmaBall({ position, id, removeRock }) {
  const props = useTexture({
    map: '/textures/Lava/Color.jpg',
    displacementMap: '/textures/Lava/Displacement.jpg',
    normalMap: '/textures/Lava/NormalGL.jpg',
    roughnessMap: '/textures/Lava/Roughness.jpg',
    // aoMap: '/textures/Lava/OCC.jpg',
    emissiveMap: '/textures/Lava/Emission.jpg',
  });

  const [collision, setCollision] = useState(true);
  const [visible, setVisible] = useState(false);

  const { scene } = useThree();

  const { opacity, pos } = useSpring({
    opacity: visible ? 1 : 0,
    pos: position,
  });

  const [ref, api] = useSphere(() => ({
    type: 'Dynamic',
    args: [30, 30, 30],
    position: position,
    userData: { name: 'MagmaBall', type: 'BossWeapon', damage: 10 },
    onCollideBegin: (e) => {
      const { name, type } = e.body.userData;
      if (type === 'boundary' || name === 'Fighter') {
        removeRock(id);
      }
    },
  }));

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 3000);
  }, []);

  useEffect(() => {
    const fighterPosition = scene.getObjectByName('Fighter').position;
    setTimeout(() => {
      if (visible && ref.current) {
        const direction = new Vector3()
          .subVectors(fighterPosition, ref.current.position)
          .normalize();
        const speed = 300; // Adjust the speed as needed
        const { x, y, z } = direction.multiplyScalar(speed);
        api.velocity.set(x, y, z);
      }
    }, 2000);
  }, [visible, ref.current]);

  return (
    <Sphere ref={ref} args={[30, 30, 30]}>
      <animated.meshStandardMaterial
        opacity={opacity}
        transparent={true}
        {...props}
        emissive={'red'}
        emissiveIntensity={8}
      />
    </Sphere>
  );
}
