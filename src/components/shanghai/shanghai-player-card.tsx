import { SHANGHAI_ACTIVE_INDICATOR } from '~/lib/utils';
import type { ShanghaiPlayer } from '~/lib/shanghai';

interface ShanghaiPlayerCardProps {
  player: ShanghaiPlayer;
  currentPlayer?: ShanghaiPlayer;
}

const ShanghaiPlayerCard = ({ player, currentPlayer }: ShanghaiPlayerCardProps) => {
  const getActivePlayerIndicatorClasses = (player: ShanghaiPlayer) =>
    ['transition-opacity opacity-0', player === currentPlayer && 'opacity-100'].filter(Boolean).join(' ');

  return (
    <div
      className="flex items-center p-2 shadow-xl/50 rounded-lg bg-zinc-700 first:z-40 gap-2"
      key={`player-${player.name}`}
    >
      <div className={getActivePlayerIndicatorClasses(player)}>{SHANGHAI_ACTIVE_INDICATOR}</div>
      <div>{player.name}</div>
      <div className="ml-auto">{player.totalScore}</div>
    </div>
  );
};

export default ShanghaiPlayerCard;
