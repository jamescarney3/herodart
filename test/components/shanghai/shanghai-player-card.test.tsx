import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import ShanghaiPlayerCard from '~/components/shanghai/shanghai-player-card';

vi.mock('~/lib/utils', () => ({
  SHANGHAI_ACTIVE_INDICATOR: 'x',
}));

describe('ShanghaiPlayerCard component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    const { container } = render(<ShanghaiPlayerCard player={{ name: 'frodo', totalScore: 10 }} />);
    expect(container).toBeDefined();
  });

  it('renders with current player', () => {
    const player = { name: 'frodo', totalScore: 10 };
    const { getByText } = render(<ShanghaiPlayerCard player={player} currentPlayer={player} />);
    const playerName = getByText('frodo');
    const activeIndicator = getByText('x');
    expect(playerName.parentNode).toBe(activeIndicator.parentNode);
    expect(activeIndicator.classList).toContain('opacity-100');
  });
});
