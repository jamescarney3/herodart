import { describe, it, expect, vi } from 'vitest';
import { render, within, fireEvent } from '@testing-library/react';

import RouletteScoreboard from '~/components/roulette/roulette-scoreboard';
import type RouletteGame from '~/lib/roulette/roulette-game';

describe('RouletteScoreboard component', () => {
  const baseRouletteGame = {
    playerOrder: [],
  } as unknown as RouletteGame;

  const startedRouletteGame = {
    ...baseRouletteGame,
    currentTurn: { checkout: 74 },
    currentPlayer: { name: 'malcolm' },
    playerOrder: [
      { name: 'malcolm', totalScore: 0, keyOrTemporaryKey: 'a' },
      { name: 'reese', totalScore: 0, keyOrTemporaryKey: 'b' },
      { name: 'francis', totalScore: 0, keyOrTemporaryKey: 'c' },
      { name: 'dewey', totalScore: 0, keyOrTemporaryKey: 'd' },
    ],
    scoreRound: vi.fn(),
  } as unknown as RouletteGame;

  it('renders without crashing', () => {
    const { container } = render(<RouletteScoreboard game={baseRouletteGame} />);

    // make sure it doesn't crash with minium props
    expect(container).toBeDefined();
  });

  describe('displaying current round data', () => {
    it('displays the current turn checkout and current player name', () => {
      const { getAllByText } = render(<RouletteScoreboard game={startedRouletteGame} />);

      // get checkout section
      const checkoutSection = getAllByText('checkout', { exact: false })[0].closest('section') as HTMLElement;

      // assert checkout and player displayed
      expect(within(checkoutSection).getByText(startedRouletteGame.currentTurn!.checkout));
      expect(within(checkoutSection).getByText(startedRouletteGame.currentPlayer!.name));
    });

    it('displays player order with total scores', () => {
      const { getByText } = render(<RouletteScoreboard game={startedRouletteGame} />);

      // get player order section by heading (should be hidden?)
      const playerOrderSection = getByText('player order', { exact: false }).closest('section') as HTMLElement;

      // find element with each player name and assert player total score is also present in it
      startedRouletteGame.playerOrder.forEach((player) => {
        const playerCard = within(playerOrderSection).getByText(player.name).closest('li') as HTMLElement;
        expect(playerCard).toBeDefined();
        expect(within(playerCard).getByText(player.totalScore)).toBeDefined();
      });
    });
  });

  describe('scoring rounds', () => {
    it('submits a checkout score', () => {
      const { getByText } = render(<RouletteScoreboard game={startedRouletteGame} />);

      const checkoutButton = getByText('checkout');
      fireEvent.click(checkoutButton);

      expect(startedRouletteGame.scoreRound).toHaveBeenCalledWith(
        startedRouletteGame.currentPlayer!,
        startedRouletteGame.currentTurn!.checkout,
      );
    });

    it('submits a non-checkout score', () => {
      const { getByText } = render(<RouletteScoreboard game={startedRouletteGame} />);

      const checkoutButton = getByText('miss');
      fireEvent.click(checkoutButton);

      expect(startedRouletteGame.scoreRound).toHaveBeenCalledWith(startedRouletteGame.currentPlayer!, 0);
    });
  });
});
