import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';

import ShanghaiGame from '~/pages/shanghai-game';

import useShanghaiGame from '~/hooks/use-shanghai-game';
import ShanghaiRules from '~/components/shanghai/shanghai-rules';
import ShanghaiSetup from '~/components/shanghai/shanghai-setup';
import ShanghaiScoreboard from '~/components/shanghai/shanghai-scoreboard';
import ShanghaiReport from '~/components/shanghai/shanghai-report';

vi.mock('~/hooks/use-shanghai-game');
vi.mock('~/components/shanghai/shanghai-rules');
vi.mock('~/components/shanghai/shanghai-setup');
vi.mock('~/components/shanghai/shanghai-scoreboard');
vi.mock('~/components/shanghai/shanghai-report');

describe('ShanghaiGame page component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    vi.mocked(useShanghaiGame).mockImplementation(() => ({}));
    const container = render(<ShanghaiGame />);
    expect(container).to.exist;
  });

  describe('with instantiated game', () => {
    beforeEach(() => {
      vi.mocked(useShanghaiGame).mockImplementation(() => ({ game: {} }));
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('renders with game in rules phase', () => {
      vi.mocked(ShanghaiRules).mockImplementation(() => <div>rules</div>);
      const { getByText } = render(<ShanghaiGame />);
      expect(getByText('rules')).to.exist;
    });

    it('renders with game in setup phase', async () => {
      vi.mocked(ShanghaiRules).mockImplementation(({ onConfirm }) => <button onClick={onConfirm}>confirm</button>);
      vi.mocked(ShanghaiSetup).mockImplementation(() => <div>setup</div>);

      const { getByText } = render(<ShanghaiGame />);
      const confirmButton = getByText('confirm');
      await act(() => confirmButton.click());
      expect(getByText('setup')).to.exist;
    });

    it('renders scoreboard when game is started', () => {
      vi.mocked(ShanghaiScoreboard).mockImplementation(() => <div>scoreboard</div>);
      vi.mocked(useShanghaiGame).mockImplementation(() => ({ game: { started: true } }));

      const { getByText } = render(<ShanghaiGame />);
      expect(getByText('scoreboard')).to.exist;
    });

    it('renders report when game is finished', () => {
      vi.mocked(ShanghaiReport).mockImplementation(() => <div>report</div>);
      vi.mocked(useShanghaiGame).mockImplementation(() => ({ game: { finished: true } }));
      const { getByText } = render(<ShanghaiGame />);
      expect(getByText('report')).to.exist;
    });
  });
});
