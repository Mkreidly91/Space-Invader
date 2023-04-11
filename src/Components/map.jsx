import { useBox } from '@react-three/cannon';

export function Map(props) {
  const { position, dimensions } = props;
  const [x, y, z] = position;
  const [width, height, depth] = dimensions;
  const [ref] = useBox(() => ({
    // create a static body with a box shape and set its dimensions
    type: 'Static',
    args: [width, height, depth],
    position: [x, y, z],
  }));

  return (
    <mesh ref={ref} name="Boundary">
      <boxBufferGeometry args={[width, height, depth]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}
