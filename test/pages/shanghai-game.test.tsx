import { describe, it, expect, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';

import useShanghaiGame from '~/hooks/use-shanghai-game';
import ShanghaiGame from '~/pages/shanghai-game';

vi.mock('~/hooks/use-shanghai-game');
vi.mock('~/components/shanghai/shanghai-setup');
vi.mock('~/components/shanghai/shanghai-scoreboard');
vi.mock('~/components/shanghai/shanghai-report');

describe('ShanghaiGame', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without game', () => {
    vi.mocked(useShanghaiGame).mockReturnValue({});
    const { container } = render(<ShanghaiGame />);
    expect(container).to.exist;
  });

  it('renders with game in setup phase', () => {
    vi.mocked(useShanghaiGame).mockReturnValue({ game: { started: false, finished: false } });

    const { container } = render(<ShanghaiGame />);
    expect(container).to.exist;
  });

  it('renders with game in progress', () => {
    vi.mocked(useShanghaiGame).mockReturnValue({ game: { started: true, finished: false } });
    const { container } = render(<ShanghaiGame />);
    expect(container).to.exist;
  });

  it('renders with finished game', () => {
    vi.mocked(useShanghaiGame).mockReturnValue({ game: { started: true, finished: true } });
    const { container } = render(<ShanghaiGame />);
    expect(container).to.exist;
  });
});
