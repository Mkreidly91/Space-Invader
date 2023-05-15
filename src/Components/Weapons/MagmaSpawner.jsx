import { useThree } from '@react-three/fiber';
import MagmaBall from './MagmaBall';
import { react, useState, useEffect } from 'react';
import short from 'short-uuid';
import { MathUtils } from 'three';

export default function MagmaSpawner() {
  const { scene, viewport } = useThree();
  const { width, height } = viewport.getCurrentViewport();
  const [rocks, setRocks] = useState([]);
  const [primed, setPrimed] = useState(false);
  const removeRock = (id) => {
    setRocks((prev) => prev.filter((rock) => rock.props.id !== id));
  };
  const rock = (position) => (
    <MagmaBall
      id={short.generate()}
      key={short.generate()}
      position={position}
      removeRock={removeRock}
    />
  );

  useEffect(() => {
    if (rocks.length === 0) {
      let direction;
      let distance;

      const { x, y, z } = scene.getObjectByName('Boss').position;

      let i = 0;
      const interval = setInterval(() => {
        direction = i % 2 === 0 ? 1 : -1;
        distance = i % 2 === 0 ? 200 * direction : 400 * direction;
        const rockPosition = MathUtils.clamp(
          Math.trunc(Math.random() * distance + distance),
          -width / 2 + 100,
          width / 2 + 100
        );

        setRocks((prev) => [...prev, rock([rockPosition, 0, z])]);
        i++;
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
      }, 10000);
    }
  }, [rocks]);

  return rocks;
}
