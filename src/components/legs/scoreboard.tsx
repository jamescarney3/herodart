import { useState } from 'react';
import { evaluate } from 'mathjs';

import { Container } from '~/components/layout';
import { PlayerCard, Keypad, ScoreToast } from '~/components/legs';
import type LegsGame from '~/lib/legs/legs-game';

interface LegsScoreboardProps {
  game: LegsGame;
}

const LegsScoreboard = ({ game }: LegsScoreboardProps) => {
  const [score, setScore] = useState('');
  const [pendingScore, setPendingScore] = useState<number | null>(null);
  const [scoring, setScoring] = useState(false);

  const scoreRound = () => {
    game.currentPlayer?.score(evaluate(score));
    setScore('');
    setPendingScore(null);
    setScoring(false);
  };

  const onSubmit = () => {
    setPendingScore(evaluate(score));
    setScoring(true);
    setTimeout(scoreRound, 500);
  };

  return (
    <Container>
      <section className="h-48 flex flex-col shrink-0">
        <h1 className="text-center text-6xl">Target:</h1>
        <div className="text-center text-9xl">{game.targetScore}</div>
      </section>
      <section className="relative flex flex-col flex-shrink overflow-hidden gap-2">
        {game.playerOrder.map((player) => (
          <PlayerCard
            key={`player-${player.name}`}
            game={game}
            player={player}
            scoring={scoring}
            score={pendingScore}
          />
        ))}
      </section>
      <Keypad
        value={score}
        onChange={(e) => setScore(e.target.value)}
        onSubmit={onSubmit}
        className="mt-auto xt-aspect:w-full t-aspect:w-full"
      />
      <ScoreToast game={game} score={pendingScore || undefined} />
    </Container>
  );
};

export default LegsScoreboard;
