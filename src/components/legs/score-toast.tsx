import type { CSSProperties } from 'react';

import { LEGS_STRIKE, LEGS_ELIMINATION, LEGS_SCORE } from '~/lib/utils';
import type LegsGame from '~/lib/legs/legs-game';

// TODO: genericize this for other purposes, low prio

interface ScoreToastProps {
  game: LegsGame;
  score?: number;
}

const ScoreToast = ({ game, score }: ScoreToastProps) => {
  // coerce this to boolean
  const scoring = score != null;

  const toastClass = [
    // outside of document flow
    'fixed',
    // top z-layer but partially transparent
    'z-50',
    'opacity-25',
    // vertically centered
    'translate-y-[-50%]',
    'top-[50%]',
    // offsecreen to the left
    'translate-x-[-100%]',
    // typogratphy
    'text-8xl',
    ...(scoring ? [
      // animate during scoring action
      'transition-transform',
      'ease-linear',
      'duration-500', // constantize this?
      // slide all the way from left to right
      'translate-x-[var(--container-width)]',
    ] : []),
  ].filter(Boolean).join(' ');

  // need to cast type here because rect doesn't think --container-width is a real key; it's not,
  // but it *is* a programmatic way to get a value interpolated into a tailwind util arbitrary val
  const toastStyle = { '--container-width': `${window.innerWidth}px` } as CSSProperties;

  const toastContent = (() => {
    if (!scoring) return;
    if (game.scoreWouldEliminateCurrentPlayer(score)) return LEGS_ELIMINATION;
    if (game.scoreWouldBeStrike(score)) return LEGS_STRIKE;
    if (scoring) return LEGS_SCORE;
  })();

  return (<div className={toastClass} style={toastStyle}>{toastContent}</div>);
};

export default ScoreToast;
