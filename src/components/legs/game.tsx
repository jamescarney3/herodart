import useLegsGame from '~/hooks/use-legs-game';
import { Setup, Scoreboard, Report } from '~/components/legs';

const Game = () => {
  const { game, newGame } = useLegsGame();

  const getGamePhase = () => {
    if (!game) return null;
    if (game?.finished) return (<Report game={game} onNewGame={newGame} />);
    if (game?.started) return (<Scoreboard game={game} />);
    return (<Setup game={game} />);
  };

  return (
    <div className="text-xl">
      {getGamePhase()}
    </div>
  );
};

export default Game;
