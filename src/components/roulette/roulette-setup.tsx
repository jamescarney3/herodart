import { useState, useRef, useEffect } from 'react';

import { Container } from '~/components/layout';
import { RoulettePlayerCard } from '~/components/roulette';
import type RouletteGame from '~/lib/roulette/roulette-game';

const RouletteSetup = ({ game }: { game: RouletteGame }) => {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [addingPlayer, setAddingPlayer] = useState(false);
  const [name, setName] = useState<string>(''); // TODO: sanitize with a chars only regex

  useEffect(() => {
    if (addingPlayer) nameInputRef.current?.focus();
  }, [addingPlayer]);

  const addNewPlayer = () => {
    setAddingPlayer(true);
  };

  const confirmNewPlayer = () => {
    game.createPlayer({ name, ordinality: game.roulettePlayers.length + 1 });
    setName('');
    setAddingPlayer(false);
  };

  const cancelNewPlayer = () => {
    setName('');
    setAddingPlayer(false);
  };

  const startGame = () => {
    // this call loses context if game.start is passed directly as onClick prop; why??
    game.startGame();
  };

  return (
    <Container>
      <section className="h-48 shrink-0 flex flex-col gap-2">
        <h1 className="text-center text-6xl mb-auto">Roulette Setup</h1>
        <label htmlFor="player-name" className="hidden">
          Name:
        </label>
        <input
          ref={nameInputRef}
          name="player-name"
          autoComplete="off"
          value={name}
          disabled={!addingPlayer}
          onChange={(e) => setName(e.target.value)}
          onKeyUp={(e) => {
            if (!!name && e.key === 'Enter') confirmNewPlayer();
          }}
          className="w-full text-center py-4 text-2xl focus:outline-none"
        />
      </section>

      <section className="flex-shrink flex flex-col gap-2 overflow-scroll">
        <ol className="relative flex flex-col flex-shrink overflow-hidden gap-2">
          {game.roulettePlayers.map((player) => (
            <RoulettePlayerCard key={`player-${player.keyOrTemporaryKey}`} player={player} game={game} />
          ))}
        </ol>
      </section>

      <section className="mt-auto shrink-0 flex flex-col gap-2">
        {!addingPlayer && (
          <>
            <button onClick={addNewPlayer} type="button" className="block w-full">
              add player
            </button>
            <button onClick={startGame} type="button" disabled={!game.canStart} className="block w-full">
              start game
            </button>
          </>
        )}
        {addingPlayer && (
          <>
            <button onClick={confirmNewPlayer} disabled={!name} type="button" className="block w-full">
              enter
            </button>
            <button onClick={cancelNewPlayer} type="button" className="block w-full">
              cancel
            </button>
          </>
        )}
      </section>
    </Container>
  );
};

export default RouletteSetup;
