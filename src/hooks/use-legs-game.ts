import { useEffect, useState, useRef } from 'react';

import Observer from '~/lib/v2/observer';
import LegsGame from '~/lib/legs/legs-game';

const useLegsGame = () => {
  const [, forceUpdate] = useState<unknown>(false);
  const gameRef = useRef<LegsGame | null>(null);

  useEffect(() => {
    // id probably becomes a uuid or deserialized from some arbitrary kind of storage eventually
    const id = 'main';
    // compiler sees create invoked as *always* returning a Model instance even though it never
    // actually can - need to find a way to type this at the model level so it can know what its
    // actually getting when that method gets called
    gameRef.current = gameRef.current ?? <LegsGame>LegsGame.create({ id });
    Observer.subscribe(forceUpdate);
    // @ts-expect-error I know this is an anti-pattern
    forceUpdate();
  }, [forceUpdate, gameRef]);


  return { game: gameRef.current || {} };
};

export default useLegsGame;
