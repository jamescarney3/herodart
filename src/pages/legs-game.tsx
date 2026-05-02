import useLegsGame from '~/hooks/use-legs-game';
import { useToggle } from '~/hooks';
import { Setup, Scoreboard, Report } from '~/components/legs';
import { GameMenuModal, MenuButton } from '~/components/shared';

const Game = () => {
  const { game, newGame } = useLegsGame();
  const [menuOpen, toggleMenuOpen] = useToggle(false);

  const getGamePhase = () => {
    if (!game) return null;
    if (game.finished) return <Report game={game} onNewGame={newGame} />;
    if (game.started) return <Scoreboard game={game} />;
    return <Setup game={game} />;
  };

  return (
    <div className="text-xl">
      <MenuButton onClick={toggleMenuOpen} />
      <GameMenuModal open={menuOpen} onClose={toggleMenuOpen} />
      {getGamePhase()}
    </div>
  );
};

export default Game;
