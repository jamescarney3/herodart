import { describe, it, afterEach, expect, beforeEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import ShanghaiReport from '~/components/shanghai/shanghai-report';
import type ShanghaiGame from '~/lib/shanghai/shanghai-game';

describe('ShanghaiReport component', () => {
  let mockGame: ShanghaiGame;

  beforeEach(() => {
    const mockPlayers = [{ name: 'charlie' }, { name: 'mac' }, { name: 'dennis' }];

    const rounds = [{ player: mockPlayers[0] }, { player: mockPlayers[1] }, { player: mockPlayers[2] }];

    mockGame = {
      players: [],
      rounds: rounds,
    };
  });

  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    const { container } = render(<ShanghaiReport game={mockGame} />);
    expect(container).toBeDefined();
  });
});
