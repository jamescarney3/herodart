import useLegsGame from '~/hooks/use-legs-game';
import { Setup, Scoreboard, Report } from '~/components/legs';
import { ContextMenu } from '~/components/shared';

const Game = () => {
  const { game, newGame, clearGame } = useLegsGame();

  const getGamePhase = () => {
    if (!game) return null;
    if (game.finished) return <Report game={game} onNewGame={newGame} />;
    if (game.started) return <Scoreboard game={game} />;
    return <Setup game={game} />;
  };

  return (
    <>
      <ContextMenu options={[{ label: 'Quit Game', onClick: clearGame }]} />
      {getGamePhase()}
    </>
  );
};

export default Game;
