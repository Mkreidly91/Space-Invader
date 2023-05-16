import { createContext, useState } from 'react';

const GameContext = createContext();
function GameContextProvider(props) {
  const [gameOver, setGameOver] = useState(false);
  console.log(gameOver);
  return (
    <GameContext.Provider value={{ gameOver, setGameOver }}>
      {props.children}
    </GameContext.Provider>
  );
}

export { GameContext, GameContextProvider };
