import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, act, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router';

import ShanghaiGamePage from '~/pages/shanghai-game';
import useShanghaiGame from '~/hooks/use-shanghai-game';
import ShanghaiRules from '~/components/shanghai/shanghai-rules';
import ShanghaiSetup from '~/components/shanghai/shanghai-setup';
import ShanghaiScoreboard from '~/components/shanghai/shanghai-scoreboard';
import ShanghaiReport from '~/components/shanghai/shanghai-report';
import { ContextMenu } from '~/components/shared';

vi.mock('react-router');
vi.mock('~/hooks/use-shanghai-game');
vi.mock('~/components/shanghai/shanghai-rules');
vi.mock('~/components/shanghai/shanghai-setup');
vi.mock('~/components/shanghai/shanghai-scoreboard');
vi.mock('~/components/shanghai/shanghai-report');
vi.mock('~/lib/shanghai/shanghai-game');
vi.mock('~/components/shared/context-menu');

describe('ShanghaiGamePage page component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    vi.mocked(useShanghaiGame).mockReturnValue({} as ReturnType<typeof useShanghaiGame>);
    const container = render(<ShanghaiGamePage />);
    expect(container).to.exist;
  });

  describe('with instantiated game', () => {
    beforeEach(() => {
      vi.mocked(useShanghaiGame).mockReturnValue({ game: {} } as ReturnType<typeof useShanghaiGame>);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('renders with game in rules phase', () => {
      vi.mocked(ShanghaiRules).mockReturnValue(<div>rules</div>);
      const { getByText } = render(<ShanghaiGamePage />);
      expect(getByText('rules')).to.exist;
    });

    it('renders with game in setup phase', async () => {
      vi.mocked(ShanghaiRules).mockImplementation(({ onConfirm }) => <button onClick={onConfirm}>confirm</button>);
      vi.mocked(ShanghaiSetup).mockReturnValue(<div>setup</div>);

      const { getByText } = render(<ShanghaiGamePage />);
      const confirmButton = getByText('confirm');
      act(() => confirmButton.click());
      expect(getByText('setup')).to.exist;
    });

    it('renders scoreboard when game is started', () => {
      vi.mocked(useShanghaiGame).mockReturnValue({ game: { started: true } } as ReturnType<typeof useShanghaiGame>);
      vi.mocked(ShanghaiScoreboard).mockReturnValue(<div>scoreboard</div>);

      const { getByText } = render(<ShanghaiGamePage />);
      expect(getByText('scoreboard')).to.exist;
    });

    it('renders report when game is finished', () => {
      vi.mocked(useShanghaiGame).mockReturnValue({ game: { finished: true } } as ReturnType<typeof useShanghaiGame>);
      vi.mocked(ShanghaiReport).mockReturnValue(<div>report</div>);

      const { getByText } = render(<ShanghaiGamePage />);
      expect(getByText('report')).to.exist;
    });

    it('quits a game', () => {
      const clearGame = vi.fn();
      vi.mocked(ContextMenu).mockImplementation((({
        options,
      }: {
        options: { label: string; onClick: () => void }[];
      }) => <button onClick={options.at(0)!.onClick}>{options.at(0)!.label}</button>) as typeof ContextMenu);
      vi.mocked(useShanghaiGame).mockReturnValue({ clearGame } as unknown as ReturnType<typeof useShanghaiGame>);
      vi.mocked(useNavigate).mockReturnValue(vi.fn());
      const { getByText } = render(<ShanghaiGamePage />);
      fireEvent.click(getByText('Quit Game'));
      expect(clearGame).toHaveBeenCalled();
    });
  });
});
