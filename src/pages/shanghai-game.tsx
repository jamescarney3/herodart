import { useState } from 'react';

import { useShanghaiGame, useToggle } from '~/hooks';
import { GameMenuModal, MenuButton } from '~/components/shared';
import { ShanghaiSetup, ShanghaiScoreboard, ShanghaiReport, ShanghaiRules } from '~/components/shanghai';

const ShanghaiGame = () => {
  const { game, newGame } = useShanghaiGame();
  const [menuOpen, toggleMenuOpen] = useToggle(false);
  const [rulesConfirmed, setRulesConfirmed] = useState(false);

  const confirmRules = () => {
    setRulesConfirmed(true);
  };

  const renderGameContent = () => {
    if (!game) return null;
    if (game.finished) return <ShanghaiReport game={game} onNewGame={newGame} />;
    if (game.started) return <ShanghaiScoreboard game={game} />;
    if (rulesConfirmed) return <ShanghaiSetup game={game} />;
    return <ShanghaiRules game={game} onConfirm={confirmRules} />;
  };

  return (
    <div>
      <MenuButton onClick={toggleMenuOpen} />
      <GameMenuModal open={menuOpen} onClose={toggleMenuOpen} />
      {renderGameContent()}
    </div>
  );
};

export default ShanghaiGame;
