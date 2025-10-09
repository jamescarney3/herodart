import { useEffect, useState, useRef } from 'react';

import Observer from '~/lib/v2/observer';
import LegsGame from '~/lib/legs/legs-game';

const useLegsGame = () => {
  const [, forceUpdate] = useState<unknown>(new Object());
  const gameRef = useRef<LegsGame | null>(null);

  useEffect(() => {
    // id probably becomes a uuid or deserialized from some arbitrary kind of storage eventually
    const id = 'main';
    // compiler sees create invoked as *always* returning a Model instance even though it never
    // actually can - need to find a way to type this at the model level so it can know what its
    // actually getting when that method gets called
    gameRef.current ??= <LegsGame>LegsGame.create({ id });
    // should this be a game serialization? important thing is that the new obj is referentially
    // separate from the previous state value
    Observer.subscribe(() => forceUpdate(() => new Object()));
    forceUpdate(() => new Object());
  }, [forceUpdate, gameRef]);


  return { game: gameRef.current };
};

export default useLegsGame;
