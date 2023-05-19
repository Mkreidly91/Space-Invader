import { createContext, useState } from 'react';

const GameContext = createContext();
function GameContextProvider(props) {
  const [gameOver, setGameOver] = useState(false);
  const [fighterHp, setFighterHp] = useState(100);
  return (
    <GameContext.Provider
      value={{ gameOver, setGameOver, fighter: [fighterHp, setFighterHp] }}
    >
      {props.children}
    </GameContext.Provider>
  );
}

export { GameContext, GameContextProvider };
