import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

import LegsGame from '~/lib/legs/legs-game';
import LegsPlayer from '~/lib/legs/legs-player';
import LegsKeypad from '~/components/legs/keypad';

interface PlayerCardProps {
  player: LegsPlayer;
  currentPlayer?: LegsPlayer;
  scoring?: boolean;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  const cardRef = useRef(null);

  const strikes = new Array(player.strikes).fill(null).map(() => <>X</>);
  return (
    <div
      ref={cardRef}
      className={`
        w-full flex items-center p-4 shadow-lg rounded-lg bg-zinc-700
      `}
      // ease-linear transition-none translate-y-[0px] first:z-40
      // style={{ ['--first-offset' as string]: firstOffset } as React.CSSProperties}
    >
      <div>{player.name}{/*} {String(transitionStart)} {String(transitioning)} {String(transitionEnd)} */}</div>
      <div className="ml-auto">{strikes}</div>
    </div>
  );
};

interface LegsScoreboardProps {
  game: LegsGame;
}

const LegsScoreboard = ({ game }: LegsScoreboardProps) => {
  const [score, setScore] = useState('');
  const [scoring, setScoring] = useState(false);
  // const [playersLeft, setPlayersLeft] = useState<number>(game.playerOrder.length);
  // const [eliminatingScore, setEliminatingScore] = useState(false);

  const scoreRound = () => {
    game.currentPlayer?.score(eval(score));
    setScore('');
    setScoring(false);
    // setPlayersLeft(game.playerOrder.length);
    // setEliminatingScore(false);
  };

  const onSubmit = () => {
    // const scoreValue = eval(score);
    // setEliminatingScore(game.scoreWouldEliminateCurrentPlayer(scoreValue));
    // scoreRound();
    setScoring(true);
    setTimeout(scoreRound, 5000);
  };

  return (
    <div className="h-screen flex flex-col gap-2 p-2">
      <h1 className="text-center text-6xl">Target:</h1>
      <div className="text-center text-9xl">{game.targetScore}</div>
      <div className="relative flex flex-col flex-shrink overflow-hidden gap-2">
        {game.playerOrder.map((player) => (
          <PlayerCard
            key={`player-${player.name}`}
            player={player}
            currentPlayer={game.currentPlayer}
            scoring={scoring}
          />
        ))}
      </div>
      <LegsKeypad
        value={score}
        onChange={(e) => setScore(e.target.value)}
        onSubmit={onSubmit}
        className="mt-auto xt-aspect:w-full t-aspect:w-full"
      />
    </div>
  );
};

export default LegsScoreboard;
