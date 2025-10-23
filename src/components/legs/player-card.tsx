import { useLayoutEffect, useRef } from 'react';

import LegsGame from '~/lib/legs/legs-game';
import LegsPlayer from '~/lib/legs/legs-player';

interface LegsPlayerCardProps {
  player: LegsPlayer;
  scoring?: boolean;
  score?: number;
  game: LegsGame;
}

const siblingVerticalDistance = (nodeA: Element, nodeB: Element): number | void => {
  if (!nodeA || !nodeB) return void 0;
  const { top: topA, bottom: bottomA } = nodeA.getBoundingClientRect();
  const { top: topB, bottom: bottomB } = nodeB.getBoundingClientRect();
  return Math.min(Math.abs(topA - bottomB), Math.abs(topB - bottomA));
};

const LegsPlayerCard = ({ player, game, scoring, score }: LegsPlayerCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const card = cardRef.current!;
    const container = card.parentNode;
    const cards = container!.children;
    const gap = siblingVerticalDistance(cards[0], cards[1]) || 0;

    const currentPlayer = player === game.currentPlayer;

    const playerEliminated = [
      score ?? null,
      currentPlayer,
      game.scoreWouldEliminateCurrentPlayer(score || 0),
    ].every(Boolean);

    const baseTransition = ['transition', 'duration-500']; // constantize this

    const getBaseOffset = () => {
      const { height } = cards[0].getBoundingClientRect();
      const totalHeight = height + gap;

      return `${totalHeight}px`;
    };

    const getCurrentOffset = () => {
      let idx = 0;
      let totalHeight = 0;

      while (idx < cards.length - 1) {
        const { height } = cards[idx].getBoundingClientRect();
        totalHeight += (height + gap);
        idx ++;
      }

      return `${totalHeight}px`;
    };

    const vOffset = currentPlayer ? getCurrentOffset() : getBaseOffset();
    const translation = (() => {
      if (playerEliminated && currentPlayer) {
        return 'translate-x-[200%]';
      } else if (currentPlayer) {
        return '!translate-y-[var(--translation-offset)]';
      } else {
        return '!-translate-y-[var(--translation-offset)]';
      }
    })();

    if (scoring) {
      // add transition and translation classes/styles if we're about to score a round
      card.style.setProperty('--translation-offset', vOffset);
      card.classList.add(...baseTransition, translation);
    } else {
      // remove transition and translation classes/styles otherwise
      card.classList.remove(
        ...baseTransition,
        'translate-x-[200%]',
        '!translate-y-[var(--translation-offset)]',
        '!-translate-y-[var(--translation-offset)]'
      );
      card.style.removeProperty('--translation-offset');
    }
  }, [player, scoring, game, score]);

  const strikes = new Array(player.strikes).fill(null).map((_, idx) => (
    <span key={`strike-${idx}`}>❌</span>
  ));

  return (
    <div
      ref={cardRef}
      className={`
        w-full flex items-center p-4 shadow-lg rounded-lg bg-zinc-700 first:z-40
      `}
    >
      <div>{player.name}</div>
      <div className="ml-auto">{strikes}</div>
    </div>
  );
};

export default LegsPlayerCard;
