import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router';

import LegsGamePage from '~/pages/legs-game';
import useLegsGame from '~/hooks/use-legs-game';
import LegsSetup from '~/components/legs/setup';
import LegsScoreboard from '~/components/legs/scoreboard';
import LegsReport from '~/components/legs/report';
import { ContextMenu } from '~/components/shared';

vi.mock('react-router');
vi.mock('~/hooks/use-legs-game');
vi.mock('~/components/legs/setup');
vi.mock('~/components/legs/scoreboard');
vi.mock('~/components/legs/report');
vi.mock('~/components/shared/context-menu');

describe('LegsGame', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    vi.mocked(useLegsGame).mockReturnValue({} as ReturnType<typeof useLegsGame>);
    const { container } = render(<LegsGamePage />);
    expect(container).to.exist;
  });

  describe('with instantiated game', () => {
    beforeEach(() => {
      vi.mocked(useLegsGame).mockReturnValue({ game: {} } as ReturnType<typeof useLegsGame>);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('renders with game in setup phase', () => {
      vi.mocked(LegsSetup).mockReturnValue(<div>setup</div>);
      const { getByText } = render(<LegsGamePage />);
      expect(getByText('setup')).to.exist;
    });

    it('renders with game in progress', () => {
      vi.mocked(LegsScoreboard).mockReturnValue(<div>scoreboard</div>);
      vi.mocked(useLegsGame).mockReturnValue({ game: { started: true } } as ReturnType<typeof useLegsGame>);
      const { getByText } = render(<LegsGamePage />);
      expect(getByText('scoreboard')).to.exist;
    });

    it('renders with finished game', () => {
      vi.mocked(LegsReport).mockReturnValue(<div>report</div>);
      vi.mocked(useLegsGame).mockReturnValue({ game: { finished: true } } as ReturnType<typeof useLegsGame>);
      const { getByText } = render(<LegsGamePage />);
      expect(getByText('report')).to.exist;
    });

    it('quits a game', () => {
      const clearGame = vi.fn();
      vi.mocked(ContextMenu).mockImplementation((({
        options,
      }: {
        options: { label: string; onClick: () => void }[];
      }) => <button onClick={options.at(0)!.onClick}>{options.at(0)!.label}</button>) as typeof ContextMenu);
      vi.mocked(useLegsGame).mockReturnValue({ clearGame } as unknown as ReturnType<typeof useLegsGame>);
      vi.mocked(useNavigate).mockReturnValue(vi.fn());
      const { getByText } = render(<LegsGamePage />);
      fireEvent.click(getByText('Quit Game'));
      expect(clearGame).toHaveBeenCalled();
    });
  });
});
