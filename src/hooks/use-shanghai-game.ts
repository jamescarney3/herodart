import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Observer } from '@jamescarney3/microrm';
import ShanghaiGame from '~/lib/shanghai/shanghai-game';

// NB: see use-legs-game hook for more detailed notes

const useLegsGame = () => {
  const [, forceUpdate] = useState<unknown>(new Object());
  const gameRef = useRef<ShanghaiGame | null>(null);

  useEffect(() => {
    gameRef.current ??= <ShanghaiGame>ShanghaiGame.create({ id: uuidv4() });

    Observer.subscribe(() => forceUpdate(() => new Object()));
    forceUpdate(() => new Object());
  }, [forceUpdate, gameRef]);

  const newGame = () => {
    // TODO: consider cleaning up after the current game if it exists
    gameRef.current = <ShanghaiGame>ShanghaiGame.create({ id: uuidv4() });
    forceUpdate(() => new Object());
  };

  return { game: gameRef.current, newGame };
};

export default useLegsGame;
