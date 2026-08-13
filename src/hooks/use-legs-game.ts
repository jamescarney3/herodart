import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Observer } from '@jamescarney3/microrm';
import LegsGame from '~/lib/legs/legs-game';

const cleanupLegsGame = (game: LegsGame): void => {
  game.legsRounds.forEach((round) => round.delete());
  game.legsPlayers.forEach((player) => player.delete());
  game.delete();
};

const useLegsGame = () => {
  const [, forceUpdate] = useState<unknown>(new Object());
  const gameRef = useRef<LegsGame | null>(null);

  useEffect(() => {
    // compiler sees create invoked as *always* returning a Model instance even though it never
    // actually can - need to find a way to type this at the model level so it can know what its
    // actually getting when that method gets called
    gameRef.current ??= <LegsGame>LegsGame.create({ id: uuidv4() });
    // should this be a game serialization? important thing is that the new obj is referentially
    // separate from the previous state value
    Observer.subscribe(() => forceUpdate(() => new Object()));
    forceUpdate(() => new Object());
  }, [forceUpdate, gameRef]);

  const newGame = () => {
    // current game ref is always set in effect hook
    cleanupLegsGame(gameRef.current!);
    gameRef.current = <LegsGame>LegsGame.create({ id: uuidv4() });
    forceUpdate(() => new Object());
  };

  const clearGame = () => {
    // current game ref is always set in effect hook
    cleanupLegsGame(gameRef.current!);
    gameRef.current = null;
    forceUpdate(() => new Object());
  };

  return { game: gameRef.current, newGame, clearGame };
};

export default useLegsGame;
