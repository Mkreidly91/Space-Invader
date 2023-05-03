import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { MathUtils } from 'three';
import Laser from './Laser';
import short from 'short-uuid';
export default function Gun({ pos }) {
  //start with an empty state, that will contain all the bullets.
  //add a bullet everytime you shoot
  //remove the bullet on collision, by passing down the state setter to the bullet.

  const [index, setIndex] = useState(0);
  const [bullets, setBullets] = useState([]);
  const [cooldown, setCooldown] = useState(false);
  //console.log(bullets.map((b) => b.props.id));
  function cleanUp(id) {
    setBullets((prev) => {
      return prev.filter((b) => b.props.id !== id);
    });
  }
  useEffect(() => {
    const keyDownFn = (e) => {
      e.stopPropagation();
      if (e.key === ' ' && !cooldown) {
        // if (e.repeat) return;
        setCooldown(true);
        setBullets((prev) => [
          ...prev,
          <Laser
            key={short.generate()}
            id={short.generate()}
            cleanUp={cleanUp}
          />,
        ]);
        setIndex((prev) => prev + 1);
      }
    };

    const keyUpFn = (e) => {
      e.stopPropagation();
      if (e.key === ' ') setCooldown(false);
    };

    document.addEventListener('keydown', keyDownFn);
    document.addEventListener('keyup', keyUpFn);

    return () => {
      document.removeEventListener('keydown', keyDownFn);
      document.removeEventListener('keyup', keyUpFn);
    };
  }, [bullets, cooldown]);

  return bullets;
}
