import { useState } from 'react';

import { ShanghaiMarks, ShanghaiKeypad, ShanghaiPlayerCard, ShanghaiRoundItem } from '~/components/shanghai';
import type { ShanghaiGame, ShanghaiRound } from '~/lib/shanghai';
import { Container } from '~/components/layout';

interface ShanghaiScoreboardProps {
  game: ShanghaiGame;
}

const ShanghaiScoreboard = ({ game }: ShanghaiScoreboardProps) => {
  const [darts, setDarts] = useState<number[]>([]);
  const [editingDartsIdx, setEditingDartsIdx] = useState<number | null>(null);
  const [editingRound, setEditingRound] = useState<ShanghaiRound | null>(null);

  const getNextDart = () => {
    return darts.length;
  };

  const scoreDart = (marks: number) => {
    const idx = editingDartsIdx ?? getNextDart();
    const skip = editingDartsIdx == null ? 0 : 1;
    // don't score more than 3 marks!
    const result = darts.toSpliced(idx, skip, marks).slice(0, 3);

    setDarts(result);
    setEditingDartsIdx(null);
  };

  const selectToEdit = (idx: number) => {
    /* istanbul ignore next -- @preserve */
    if (darts.length > idx) setEditingDartsIdx(idx);
  };

  const canScoreRound = darts.length === 3;

  const scoreRound = () => {
    game.scoreRound(game.currentPlayer!, darts as [number, number, number]);
    setDarts([]);
  };

  const editRound = (round: ShanghaiRound) => {
    setEditingRound(round);
    setDarts(round.darts);
  };

  const updateRound = () => {
    // assertion okay here; only ever fired condiitonally if editing round is truthy
    editingRound!.darts = darts as [number, number, number];
    setEditingRound(null);
    setDarts([]);
  };

  return (
    <Container>
      <section>
        <h1 className="text-center text-6xl">{game.currentPlayer!.name}</h1>
        <div className="text-center text-6xl">to shoot: {game.currentWedge}</div>
      </section>
      <section className="mt-4 flex flex-col overflow-scroll gap-1">
        {game.staticPlayerOrder.map((player) => (
          <ShanghaiPlayerCard player={player} currentPlayer={game.currentPlayer!} key={`player-${player.name}`} />
        ))}
      </section>
      <section className="mt-4 flex flex-col grow flex-shrink">
        <h2>Rounds:</h2>
        <div className="grow basis-0 overflow-auto">
          <div
            ref={(node) => {
              if (!editingRound && node) node?.scrollIntoView?.({ behavior: 'smooth' });
            }}
          >
            {game.shanghaiRounds.toReversed().map((round) => (
              <ShanghaiRoundItem
                key={`${round.shanghaiPlayer.name}-${round.wedge}`}
                round={round}
                editingRound={editingRound}
                onClick={editRound}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="mt-auto flex justify-around">
        <ShanghaiMarks darts={darts} editing={editingDartsIdx} onSelect={selectToEdit} />
      </section>
      <section className="xt-aspect:w-full t-aspect:w-full">
        <ShanghaiKeypad onClickNumber={scoreDart} />
      </section>
      <section>
        <button
          onClick={editingRound ? updateRound : scoreRound}
          disabled={!canScoreRound}
          className="w-full py-5 text-3xl"
        >
          enter
        </button>
      </section>
    </Container>
  );
};

export default ShanghaiScoreboard;
