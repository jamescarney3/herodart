import { useNavigate } from 'react-router';

import { ContextMenu } from '~/components/shared';
import useRouletteGame from '~/hooks/use-roulette-game';
import { RouletteSetup, RouletteScoreboard, RouletteReport } from '~/components/roulette';

const Game = () => {
  const { game, newGame } = useRouletteGame();
  const navigate = useNavigate();

  const quitGame = () => {
    navigate('/');
  };

  const getGamePhase = () => {
    if (!game) return null;
    if (game.finished) return <RouletteReport game={game} onNewGame={newGame} />;
    if (game.started) return <RouletteScoreboard game={game} />;
    return <RouletteSetup game={game} />;
  };

  return (
    <>
      <ContextMenu options={[{ label: 'Quit Game', onClick: quitGame }]} />
      {getGamePhase()}
    </>
  );
};

export default Game;
