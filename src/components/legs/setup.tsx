import { useState, useEffect, useRef } from 'react';

import { Keypad, PlayerCard } from '~/components/legs';
import type LegsGame from '~/lib/legs/legs-game';

interface LegsSetupProps {
  game: LegsGame;
}

const LegsSetup = ({ game }: LegsSetupProps) => {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>('');
  const [splash, setSplash] = useState<string>('');
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [splashing, setSplashing] = useState(false);

  useEffect(() => {
    if (addingPlayer) nameInputRef.current?.focus();
  }, [addingPlayer]);

  const onStart = () => {
    // this call loses context if game.start is passed directly as onClick prop; why??
    game.start();
  };

  const onNewPlayer = () => {
    setAddingPlayer(true);
    setSplashing(false);
  };

  const cancelNewPlayer = () => {
    setName('');
    setAddingPlayer(false);
    setSplashing(false);
  };

  const generateUndoHandler = () => {
    if (splash) return;
    return cancelNewPlayer;
  };

  const onSubmit = () => {
    try {
      game.createPlayer({ name, splash: eval(splash) || 0 });
      setSplash('');
      setName('');
      setAddingPlayer(false);
      setSplashing(false);
    } catch (e: unknown) {
      console.log((e as Error).message);
    }
  };

  return (
    <div className="h-screen flex flex-col p-2 gap-2">
      <section className="h-48 shrink-0 flex flex-col gap-2">
        <h1 className="text-center text-6xl mb-auto">Legs Setup</h1>
        {splashing && <p className="test-center">splash (2 darts) for turn order:</p>}
        <label htmlFor="player-name" className="hidden">Name:</label>
        <input
          ref={nameInputRef}
          name="player-name"
          autoComplete="off"
          readOnly={splashing}
          value={name}
          disabled={splashing || !addingPlayer}
          onChange={(e) => setName(e.target.value)}
          onKeyUp={(e) => { if (e.key === 'Enter') setSplashing(true); }}
          className="w-full text-center py-4 text-2xl focus:outline-none"
        />
      </section>

      <section className="flex-shrink flex flex-col gap-2 overflow-scroll">
        {game.playerOrder.map((player) => (
          <PlayerCard key={`player-${player.name}`} game={game} player={player} />
        ))}
      </section>

      <section className="mt-auto shrink-0 flex flex-col gap-2">
        {!addingPlayer && (
          <>
            <button onClick={onNewPlayer} type="button" className="block w-full">
              add player
            </button>
            <button onClick={onStart} type="button" disabled={!game.canStart} className="block w-full">
              start game
            </button>
          </>
        )}
        {addingPlayer && !splashing && (
          <>
            <button onClick={() => setSplashing(true)} disabled={!name} type="button" className="block w-full">
              enter
            </button>
            <button onClick={cancelNewPlayer} type="button" className="block w-full">
              cancel
            </button>
          </>
        )}
        {splashing && (
          <Keypad
            value={splash}
            onChange={(e) => setSplash(e.target.value)}
            onUndo={generateUndoHandler()}
            onSubmit={onSubmit}
            className="mt-auto xt-aspect:w-full t-aspect:w-full"
          />
        )}
      </section>
    </div>
  );
};

export default LegsSetup;
