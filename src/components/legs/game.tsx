import useLegsGame from '~/hooks/use-legs-game';
import Setup from '~/components/legs/setup';
import Scoreboard from '~/components/legs/scoreboard';

const Game = () => {
  const { game } = useLegsGame();

  if (!game) return null;
  return (
    <div className="text-xl">
      {!game.started && <Setup game={game} />}
      {game.started && <Scoreboard game={game} />}
    </div>
  );
};

export default Game;
