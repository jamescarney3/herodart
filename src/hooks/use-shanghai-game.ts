import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Observer } from '@jamescarney3/microrm';
import { ShanghaiGame, ShanghaiRules } from '~/lib/shanghai';

// NB: see use-legs-game hook for more detailed notes

const initShanghaiGame = (): ShanghaiGame => {
  const rules = ShanghaiRules.create({ id: uuidv4(), started: false });
  const game = ShanghaiGame.create({ id: uuidv4(), rules });
  return game as ShanghaiGame;
};

const cleanupShanghaiGame = (game: ShanghaiGame): void => {
  game.rounds.forEach((round) => round.delete());
  game.players.forEach((player) => player.delete());
  game.delete();
};

const useLegsGame = () => {
  const [, forceUpdate] = useState<unknown>(new Object());
  const gameRef = useRef<ShanghaiGame | null>(null);

  useEffect(() => {
    gameRef.current ??= initShanghaiGame();

    Observer.subscribe(() => forceUpdate(() => new Object()));
    forceUpdate(() => new Object());
  }, [forceUpdate, gameRef]);

  const newGame = () => {
    cleanupShanghaiGame(gameRef.current);
    gameRef.current = initShanghaiGame();
    forceUpdate(() => new Object());
  };

  return { game: gameRef.current, newGame };
};

export default useLegsGame;
