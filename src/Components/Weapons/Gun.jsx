import { useFrame } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { MathUtils } from 'three';
import Laser from './Laser';
export default function Gun({ pos }) {
  //start with an empty state, that will contain all the bullets.
  //add a bullet everytime you shoot
  //remove the bullet on collision, by passing down the state setter to the bullet.

  const [bullets, setBullets] = useState([]);
  const [newBullet, setNewBullet] = useState([]);
  const [shoot, setShoot] = useState(false);
  const [cooldown, setCoolDown] = useState(false);
  const [c, setC] = useState(0);

  function fire() {
    setTimeout(() => {
      setBullets((prev) => [<Laser fighterPosition={pos} cleanUp={cleanUp} />]);
    }, 500);
  }
  function cleanUp(uuid) {
    setBullets(bullets.filter((b) => b.uuid !== uuid));
  }
  useEffect(() => {
    const shootfn = (e) => {
      e.preventDefault();
      if (e.key === ' ' && !cooldown) {
        setCoolDown(true);
        setShoot(true);
        // fire();
      }
    };
    const shoot = document.addEventListener('keydown', shootfn);

    const stopfn = (e) => {
      e.preventDefault();
      if (e.key === ' ') {
        setCoolDown(false);
        setShoot(false);
      }
    };
    const stop = document.addEventListener('keyup', stopfn);
    return () => {
      document.removeEventListener(shoot, shootfn);
      document.removeEventListener(stop, stopfn);
    };
  });
  useFrame(() => {
    if (shoot) {
      fire();
    }
  });

  return bullets;
}
