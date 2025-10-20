import { useState, useCallback } from 'react';

import type LegsGame from '~/lib/legs/legs-game';
import Keypad from '~/components/legs/keypad';

interface LegsSetupProps {
  game: LegsGame;
}

const LegsSetup = ({ game }: LegsSetupProps) => {
  const [name, setName] = useState<string>('');
  const [splash, setSplash] = useState<string>('');
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [splashing, setSplashing] = useState(false);

  const focusInput = useCallback((input: HTMLInputElement) => input && input.focus(), []);

  const onStart = () => {
    // this call loses context if game.start is passed directly as onClick prop; why??
    game.start();
  };

  const onNewPlayer = () => {
    setAddingPlayer(true);
    setSplashing(false);
  };

  const cancelNewPlayer = () => {
    setAddingPlayer(false);
    setSplashing(false);
  };

  const onSubmit = () => {
    try {
      game.createPlayer({ name, splash: eval(splash) });
      setSplash('');
      setName('');
      setAddingPlayer(false);
      setSplashing(false);
    } catch (e: unknown) {
      console.log((e as Error).message);
    }
  };

  return (
    <div className="max-h-screen flex flex-col gap-2 p-2">
      <div className="mt-40 flex flex-col gap-2">
        {!addingPlayer && (
          <button onClick={onNewPlayer} type="button" className="block w-full">
            add player
          </button>
        )}
        {!addingPlayer && game.canStart && (
          <button onClick={onStart} type="button" className="block w-full">
            start game
          </button>
        )}
        {addingPlayer && (
          <>
            <label htmlFor="player-name" className="hidden">
              Name:
            </label>
            <input
              ref={focusInput}
              name="player-name"
              autoComplete="off"
              readOnly={splashing}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-center py-2 text-2xl focus:outline-none"
            />
            {!splashing && (
              <>
                <button onClick={() => setSplashing(true)} type="button" className="block w-full">
                  enter
                </button>
                <button onClick={cancelNewPlayer} type="button" className="block w-full">
                  cancel
                </button>
              </>
            )}
          </>
        )}
      </div>
      <div className="flex-shrink overflow-scroll">
        {game.players.map((player) => (
          <div key={`player-${player.name}`} className="flex">
            <div>{player.name}</div>
            <div className="ml-auto">{player.splash}</div>
          </div>
        ))}
      </div>
      {splashing && (
        <Keypad
          value={splash}
          onChange={(e) => setSplash(e.target.value)}
          onSubmit={onSubmit}
          className="mt-auto xt-aspect:w-full t-aspect:w-full"
        />
      )}
    </div>
  );
};

export default LegsSetup;
