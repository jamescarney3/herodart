import { useEffect, useState, useRef } from 'react';

import Observer from '~/lib/v2/observer';
import LegsGame from '~/lib/legs/legs-game';

const useLegsGame = () => {
  const [, forceUpdate] = useState(false);
  const gameRef = useRef(null);

  useEffect(() => {
    // id probably becomes a uuid or deserialized from some arbitrary kind of storage eventually
    const id = 'main';
    gameRef.current = gameRef.current ?? LegsGame.create({ id });
    Observer.subscribe(forceUpdate);
    forceUpdate();
  }, [forceUpdate, gameRef]);


  return { game: gameRef.current || {} };
};

export default useLegsGame;
