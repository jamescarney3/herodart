import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router';

import RouletteGamePage from '~/pages/roulette-game-page';
import useRouletteGame from '~/hooks/use-roulette-game';
import { RouletteSetup, RouletteScoreboard, RouletteReport } from '~/components/roulette';
import { ContextMenu } from '~/components/shared';

vi.mock('react-router');
vi.mock('~/hooks/use-roulette-game');
vi.mock('~/components/roulette/roulette-setup');
vi.mock('~/components/roulette/roulette-scoreboard');
vi.mock('~/components/roulette/roulette-report');
vi.mock('~/components/shared/context-menu');

describe('RouletteGamePage', () => {
  it('renders without crashing', () => {
    vi.mocked(useRouletteGame).mockReturnValue({} as ReturnType<typeof useRouletteGame>);
    const { container } = render(<RouletteGamePage />);
    expect(container).to.exist;
  });

  describe('with instantiated game', () => {
    it('renders with game in setup phase', () => {
      vi.mocked(useRouletteGame).mockReturnValue({ game: {} } as ReturnType<typeof useRouletteGame>);
      vi.mocked(RouletteSetup).mockReturnValue(<div>setup</div>);
      const { getByText } = render(<RouletteGamePage />);
      expect(getByText('setup')).to.exist;
    });

    it('renders with game in progress', () => {
      vi.mocked(useRouletteGame).mockReturnValue({ game: { started: true } } as ReturnType<typeof useRouletteGame>);
      vi.mocked(RouletteScoreboard).mockReturnValue(<div>scoreboard</div>);
      const { getByText } = render(<RouletteGamePage />);
      expect(getByText('scoreboard')).to.exist;
    });

    it('renders with finished game', () => {
      vi.mocked(useRouletteGame).mockReturnValue({ game: { finished: true } } as ReturnType<typeof useRouletteGame>);
      vi.mocked(RouletteReport).mockReturnValue(<div>report</div>);
      const { getByText } = render(<RouletteGamePage />);
      expect(getByText('report')).to.exist;
    });

    it('quits a game', () => {
      // const clearGame = vi.fn();
      vi.mocked(ContextMenu).mockImplementation((({
        options,
      }: {
        options: { label: string; onClick: () => void }[];
      }) => <button onClick={options.at(0)!.onClick}>{options.at(0)!.label}</button>) as typeof ContextMenu);

      // vi.mocked(useRouletteGame).mockReturnValue({ clearGame } as unknown as ReturnType<typeof useRouletteGame>);
      vi.mocked(useNavigate).mockReturnValue(vi.fn());
      const { getByText } = render(<RouletteGamePage />);
      fireEvent.click(getByText('Quit Game'));
      expect(useNavigate).toHaveBeenCalled();
    });
  });
});
