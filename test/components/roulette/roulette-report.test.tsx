import { describe, it, expect, vi } from 'vitest';
import { render, within, fireEvent } from '@testing-library/react';

import RouletteReport from '~/components/roulette/roulette-report';
import type RouletteGame from '~/lib/roulette/roulette-game';

describe.todo('RouletteReport component', () => {
  const baseRouletteGame = {
    winner: {},
    highCheckoutRounds: [],
    playerOrder: [],
  } as unknown as RouletteGame;

  const finishedRouletteGame = {
    ...baseRouletteGame,
    winner: { name: 'francis', totalScore: 3 },
    highCheckoutRounds: [{ roulettePlayer: { name: 'malcolm' }, score: 94, keyOrTemporaryKey: 'a' }],
    playerOrder: [
      { name: 'malcolm', totalScore: 1, checkouts: [94], keyOrTemporaryKey: 'a' },
      { name: 'reese', totalScore: 2, checkouts: [60, 94], keyOrTemporaryKey: 'b' },
      { name: 'francis', totalScore: 3, checkouts: [74, 36, 60], keyOrTemporaryKey: 'c' },
      { name: 'dewey', totalScore: 0, checkouts: [], keyOrTemporaryKey: 'd' },
    ],
  } as unknown as RouletteGame;

  const startNewGame = vi.fn();

  it('renders without crashing', () => {
    const { container } = render(<RouletteReport game={baseRouletteGame} onNewGame={startNewGame} />);

    // make sure it doesn't crash with minium props
    expect(container).toBeDefined();
  });

  describe('displaying game results', () => {
    it('displays winning player and score', () => {
      const { getByText } = render(<RouletteReport game={finishedRouletteGame} onNewGame={startNewGame} />);

      // get winner display section by heading
      const winnerSection = getByText('winner', { exact: false }).closest('section') as HTMLElement;

      // expect section to include winner data
      expect(within(winnerSection).getByText(finishedRouletteGame.winner!.name, { exact: false }));
      expect(within(winnerSection).getByText(finishedRouletteGame.winner!.totalScore, { exact: false }));
    });

    it('displays high checkouts', () => {
      const { getByText } = render(<RouletteReport game={finishedRouletteGame} onNewGame={startNewGame} />);

      // get high checkouts table by closest to caption
      const highCheckoutsTable = getByText('high checkout', { exact: false }).closest('table') as HTMLElement;

      // use cells matching high checkouts in table to find a row for each high checkout round,
      // assert other round data is also in row
      finishedRouletteGame.highCheckoutRounds.forEach((checkout) => {
        const row = within(highCheckoutsTable).getByText(checkout.score).closest('tr') as HTMLElement;
        expect(row).toBeDefined();
        expect(within(row).getAllByText(checkout.roulettePlayer.name)).toBeDefined();
      });
    });

    it('displays total scores and checkouts for all players', () => {
      const { getByText } = render(<RouletteReport game={finishedRouletteGame} onNewGame={startNewGame} />);

      // get score table by closest to caption
      const scoreTable = getByText('player performance', { exact: false }).closest('table') as HTMLElement;

      // use cells matching player names in table to find a row for each player, assert
      // player performance data is also in row
      finishedRouletteGame.playerOrder.forEach((player) => {
        const row = within(scoreTable).getByText(player.name).closest('tr') as HTMLElement;
        expect(row).toBeDefined();
        expect(within(row).getByText(player.totalScore)).toBeDefined();
        player.checkouts!.forEach((checkout) => {
          expect(within(row).getByText(checkout, { exact: false })).toBeDefined();
        });
      });
    });
  });

  describe('transitioning away', () => {
    it('starts another roulette game on new game button click', () => {
      const { getByText } = render(<RouletteReport game={baseRouletteGame} onNewGame={startNewGame} />);

      // find button, click, and assert callback called
      const newGameButton = getByText('new game', { exact: false });
      fireEvent.click(newGameButton);
      expect(startNewGame).toHaveBeenCalled();
    });
  });
});
