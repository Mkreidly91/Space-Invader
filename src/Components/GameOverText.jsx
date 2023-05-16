import { Text3D } from '@react-three/drei';

export default function GameOverText() {
  return (
    <Text3D position={[0, 200, 0]} scale={3}>
      GAME OVER
    </Text3D>
  );
}
