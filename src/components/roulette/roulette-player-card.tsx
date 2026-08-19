// import { useLayoutEffect, useRef } from 'react';

import { ROULETTE_ACTIVE_INDICATOR } from '~/lib/utils';
import type { RouletteGame, RoulettePlayer } from '~/lib/roulette';

interface RoulettePlayerCardProps {
  player: RoulettePlayer;
  scoring?: boolean;
  game: RouletteGame;
}

// TODO: animate this!
const RoulettePlayerCard = ({ player, game }: RoulettePlayerCardProps) => {
  const isCurrentPlayer = player === game.currentPlayer;

  const currentPlayerBadgeClasses = ['transition-opacity', 'opacity-0', isCurrentPlayer && 'opacity-100']
    .filter(Boolean)
    .join(' ');

  return (
    <li className="flex items-center p-4 shadow-xl/50 rounded-lg bg-zinc-700 first:z-40 gap-2">
      <span className={currentPlayerBadgeClasses}>{ROULETTE_ACTIVE_INDICATOR}</span>
      <span>{player.name}</span>
      <span className="ml-auto">{player.totalScore}</span>
    </li>
  );
};

export default RoulettePlayerCard;
