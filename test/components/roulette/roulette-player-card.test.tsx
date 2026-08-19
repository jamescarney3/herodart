import { describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/react';

import { RoulettePlayerCard } from '~/components/roulette';
import { ROULETTE_ACTIVE_INDICATOR } from '~/lib/utils';
import type { RouletteGame, RoulettePlayer } from '~/lib/roulette';

vi.mock('~/lib/roulette');

describe('RoulettePlayerCard component', () => {
  it('renders without crashing', () => {
    const game = {} as RouletteGame;
    const player = {} as RoulettePlayer;

    const { container } = render(<RoulettePlayerCard game={game} player={player} />);

    expect(container).toBeDefined();
  });

  describe('differentiating between active and other players', () => {
    it('displays active player with indicator', () => {});
    const currentPlayer = { name: 'current' } as RoulettePlayer;
    const game = { currentPlayer: currentPlayer } as RouletteGame;

    const { getByText } = render(<RoulettePlayerCard game={game} player={currentPlayer} />);
    const cardContainer = getByText(currentPlayer.name).closest('li') as HTMLElement;
    expect(within(cardContainer).getByText(ROULETTE_ACTIVE_INDICATOR)).toBeDefined();
  });
});
