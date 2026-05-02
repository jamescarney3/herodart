import { describe, it, afterEach, expect, beforeEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import ShanghaiReport from '~/components/shanghai/shanghai-report';
import type { ShanghaiGame, ShanghaiPlayer } from '~/lib/shanghai';

describe('ShanghaiReport component', () => {
  let mockGame: ShanghaiGame;
  let mockPlayers: ShanghaiPlayer[];

  beforeEach(() => {
    mockPlayers = [
      { name: 'charlie', splash: 10, totalScore: 15, mpr: 1 },
      { name: 'mac', splash: 11, totalScore: 16, mpr: 2 },
      { name: 'dennis', splash: 12, totalScore: 17, mpr: 3 },
    ];

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

  it('displays a single winner correctly', () => {
    const game = vi.mockObject(mockGame);
    game.winners = [{ name: 'zaphod' }];
    const { getByText } = render(<ShanghaiReport game={game} />);
    expect(getByText('Winner:')).toBeDefined();
  });

  it('displays multiple winners correctly', () => {
    const game = vi.mockObject(mockGame);
    game.winners = [{ name: 'zaphod' }, { name: 'arthur' }, { name: 'ford' }];
    const { getByText } = render(<ShanghaiReport game={game} />);
    expect(getByText('Winners (tie):')).toBeDefined();
  });

  it('displays players', () => {
    const game = vi.mockObject(mockGame);
    game.players = mockPlayers;
    const { getByText } = render(<ShanghaiReport game={game} />);

    expect(getByText(mockPlayers.at(0).name)).toBeDefined();
    expect(getByText(mockPlayers.at(1).name)).toBeDefined();
    expect(getByText(mockPlayers.at(2).name)).toBeDefined();
  });

  it('displays shanghai result', () => {
    const game = vi.mockObject(mockGame);
    game.shanghaiScored = true;
    game.rounds = [{ player: mockPlayers[0] }, { player: mockPlayers[0], isShanghai: true }];
    const { getByText } = render(<ShanghaiReport game={game} />);
    expect(getByText('Shanghai?')).toBeDefined();
    expect(getByText('Shanghai!')).toBeDefined();
  });
});
