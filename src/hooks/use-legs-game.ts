import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Observer from '~/lib/v2/observer';
import LegsGame from '~/lib/legs/legs-game';

const useLegsGame = () => {
  const [, forceUpdate] = useState<unknown>(new Object());
  const gameRef = useRef<LegsGame | null>(null);

  useEffect(() => {
    // compiler sees create invoked as *always* returning a Model instance even though it never
    // actually can - need to find a way to type this at the model level so it can know what its
    // actually getting when that method gets called
    gameRef.current ??= <LegsGame>LegsGame.create({ id });
    // should this be a game serialization? important thing is that the new obj is referentially
    // separate from the previous state value
    Observer.subscribe(() => forceUpdate(() => new Object()));
    forceUpdate(() => new Object());
  }, [forceUpdate, gameRef]);

  const newGame = () => {
    // cleanup all legs-related model instances until there's a good serialization and
    // storage strategy for them; likely localStorage initially if not server side
    const game = gameRef.current;
    if (game) {
      const { players, rounds } = game;
      game.delete();
      players!.forEach((player) => player.delete());
      rounds!.forEach((round) => round.delete());
    }

    gameRef.current = <LegsGame>LegsGame.create({ id: uuidv4() });
    forceUpdate(() => new Object());
  };

  return { game: gameRef.current, newGame };
};

export default useLegsGame;
