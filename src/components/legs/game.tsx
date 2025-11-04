import useLegsGame from '~/hooks/use-legs-game';
import { Setup, Scoreboard, Report } from '~/components/legs';

const Game = () => {
  const { game, newGame } = useLegsGame();

  if (!game) return null;
  return (
    <div className="text-xl">
      {!game.started && <Setup game={game} />}
      {game.started && !game.finished && <Scoreboard game={game} />}
      {game.finished && <Report game={game} onNewGame={newGame} />}
    </div>
  );
};

export default Game;
