import { describe, it, expect, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';

import useLegsGame from '~/hooks/use-legs-game';
import LegsGame from '~/pages/legs-game';

vi.mock('~/hooks/use-legs-game');
vi.mock('~/components/legs/setup');
vi.mock('~/components/legs/scoreboard');
vi.mock('~/components/legs/report');

describe('LegsGame', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without game', () => {
    vi.mocked(useLegsGame).mockReturnValue({});
    const { container } = render(<LegsGame />);
    expect(container).to.exist;
  });

  it('renders with game in setup phase', () => {
    vi.mocked(useLegsGame).mockReturnValue({ game: { started: false } });
    const { container } = render(<LegsGame />);
    expect(container).to.exist;
  });

  it('renders with game in progress', () => {
    vi.mocked(useLegsGame).mockReturnValue({ game: { started: true, finished: false } });
    const { container } = render(<LegsGame />);
    expect(container).to.exist;
  });

  it('renders with finished game', () => {
    vi.mocked(useLegsGame).mockReturnValue({ game: { started: true, finished: true } });
    const { container } = render(<LegsGame />);
    expect(container).to.exist;
  });
});
