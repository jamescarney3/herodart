import { useShanghaiGame, useToggle } from '~/hooks';
import { ShanghaiSetup, ShanghaiScoreboard, ShanghaiReport } from '~/components/shanghai';
import { GameMenuModal, MenuButton } from '~/components/shared';

const ShanghaiGame = () => {
  const { game, newGame } = useShanghaiGame();
  const [menuOpen, toggleMenuOpen] = useToggle(false);

  const getGamePhase = () => {
    if (!game) return null;
    if (game.finished) return <ShanghaiReport game={game} onNewGame={newGame} />;
    if (game.started) return <ShanghaiScoreboard game={game} />;
    return <ShanghaiSetup game={game} />;
  };

  return (
    <div className="text-xl">
      <MenuButton onClick={toggleMenuOpen} />
      <GameMenuModal open={menuOpen} onClose={toggleMenuOpen} />
      {getGamePhase()}
    </div>
  );
};

export default ShanghaiGame;
