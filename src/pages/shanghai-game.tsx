import { useShanghaiGame } from '~/hooks';
import { ShanghaiSetup, ShanghaiScoreboard, ShanghaiReport } from '~/components/shanghai';

const ShanghaiGame = () => {
  const { game, newGame } = useShanghaiGame();

  const getGamePhase = () => {
    if (!game) return null;
    if (game?.finished) return (<ShanghaiReport game={game} onNewGame={newGame} />);
    if (game?.started) return (<ShanghaiScoreboard game={game} />);
    return (<ShanghaiSetup game={game} />);
  };

  return (
    <div className="text-xl">
      {getGamePhase()}
    </div>
  );
};

export default ShanghaiGame;
