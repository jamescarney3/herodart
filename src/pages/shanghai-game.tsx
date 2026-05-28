import { useState } from 'react';

import { useShanghaiGame } from '~/hooks';
import { ContextMenu } from '~/components/shared';
import { ShanghaiSetup, ShanghaiScoreboard, ShanghaiReport, ShanghaiRules } from '~/components/shanghai';

const ShanghaiGame = () => {
  const { game, newGame, clearGame } = useShanghaiGame();
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
    <>
      <ContextMenu options={[{ label: 'Quit Game', onClick: clearGame }]} />
      {renderGameContent()}
    </>
  );
};

export default ShanghaiGame;
