import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Observer from '~/lib/v2/observer';
import ShanghaiGame from '~/lib/shanghai/shanghai-game';

// NB: see use-legs-game hook for more detailed notes

const useLegsGame = () => {
  const [, forceUpdate] = useState<unknown>(new Object());
  const gameRef = useRef<ShanghaiGame | null>(null);

  useEffect(() => {
    gameRef.current ??= <ShanghaiGame>ShanghaiGame.create({ id: uuidv4() });

    // if (gameRef.current) {
    //   const game = gameRef.current;
    //
    //   if (!game.players.length) {
    //     game.createPlayer({ name: 'james', splash: 20 });
    //     game.createPlayer({ name: 'maloof', splash: 30 });
    //     game.createPlayer({ name: 'scotty', splash: 40 });
    //
    //     game.start();
    //   }
    // }

    Observer.subscribe(() => forceUpdate(() => new Object()));
    forceUpdate(() => new Object());
  }, [forceUpdate, gameRef]);

  const newGame = () => {
    const game = gameRef.current;
    if (game) {
      const { players, rounds } = game;
      game.delete();
      players!.forEach((player) => player.delete());
      rounds!.forEach((round) => round.delete());
    }

    gameRef.current = <ShanghaiGame>ShanghaiGame.create({ id: uuidv4() });
    forceUpdate(() => new Object());
  };

  return { game: gameRef.current, newGame };
};

export default useLegsGame;
