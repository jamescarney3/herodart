import { useEffect, useState, useRef } from 'react';
import { Observer } from '@jamescarney3/microrm';

import RouletteGame from '~/lib/roulette/roulette-game';

const useRouletteGame = () => {
  const [, forceUpdate] = useState<unknown>(new Object());
  const gameRef = useRef<RouletteGame | null>(null);

  useEffect(() => {
    gameRef.current ??= RouletteGame.create();
    Observer.subscribe(() => forceUpdate(() => new Object()));
    forceUpdate(() => new Object());
  }, [forceUpdate, gameRef]);

  const newGame = () => {
    gameRef.current = RouletteGame.create();
    forceUpdate(() => new Object());
  };

  return { game: gameRef.current, newGame };
};

export default useRouletteGame;
