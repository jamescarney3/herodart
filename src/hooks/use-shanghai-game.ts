import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Observer } from '@jamescarney3/microrm';
import { ShanghaiGame, ShanghaiRules, ShanghaiPlayer, ShanghaiRound } from '~/lib/shanghai';

// NB: see use-legs-game hook for more detailed notes

const initShanghaiGame = (): ShanghaiGame => {
  const shanghaiRules = ShanghaiRules.create({ id: uuidv4(), started: false });
  const game = ShanghaiGame.create({ id: uuidv4(), shanghaiRules });

  return game;
};

const cleanupShanghaiGame = (game: ShanghaiGame): void => {
  game.shanghaiRounds.forEach((round: ShanghaiRound) => round.delete());
  game.shanghaiPlayers.forEach((player: ShanghaiPlayer) => player.delete());
  game.delete();
};

const useShanghaiGame = () => {
  const [, forceUpdate] = useState<unknown>(new Object());
  const gameRef = useRef<ShanghaiGame | null>(null);

  useEffect(() => {
    gameRef.current ??= initShanghaiGame();

    Observer.subscribe(() => forceUpdate(() => new Object()));
    forceUpdate(() => new Object());
  }, [forceUpdate, gameRef]);

  const newGame = () => {
    // current game ref is always set in effect hook
    cleanupShanghaiGame(gameRef.current!);
    gameRef.current = initShanghaiGame();
    forceUpdate(() => new Object());
  };

  const clearGame = () => {
    // current game ref is always set in effect hook
    cleanupShanghaiGame(gameRef.current!);
    gameRef.current = null;
    forceUpdate(() => new Object());
  };

  return { game: gameRef.current, newGame, clearGame };
};

export default useShanghaiGame;
