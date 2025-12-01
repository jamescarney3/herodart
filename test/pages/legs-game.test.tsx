import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import LegsGame from '~/pages/legs-game';

describe('LegsGame', () => {
  it('renders without game', () => {
    const { container } = render(<LegsGame />);
    expect(container).to.exist;
  });

  it('renders with game in setup phase', () => {
    const game = { started: false };
    const { container } = render(<LegsGame game={game} />);
    expect(container).to.exist;
  });

  it('renders with game in progress', () => {
    const game = { started: true, finished: false };
    const { container } = render(<LegsGame game={game} />);
    expect(container).to.exist;
  });

  it('renders with finished game', () => {
    const game = { started: true, finished: true };
    const { container } = render(<LegsGame game={game} />);
    expect(container).to.exist;
  });
});
