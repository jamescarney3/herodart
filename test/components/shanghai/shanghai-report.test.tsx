import { describe, it, afterEach, expect, beforeEach, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import ShanghaiReport from '~/components/shanghai/shanghai-report';
import type ShanghaiGame from '~/lib/shanghai/shanghai-game';

describe('ShanghaiReport component', () => {
  let mockGame: ShanghaiGame;
  let mockPlayers: ShanghaiGame['shanghaiPlayers'];

  beforeEach(() => {
    mockPlayers = [
      { name: 'charlie', splash: 10, totalScore: 15, mpr: 1 },
      { name: 'mac', splash: 11, totalScore: 16, mpr: 2 },
      { name: 'dennis', splash: 12, totalScore: 17, mpr: 3 },
    ] as ShanghaiGame['shanghaiPlayers'];

    mockGame = vi.mockObject({
      shanghaiPlayers: [] as unknown as ShanghaiGame['shanghaiPlayers'],
      shanghaiRounds: [] as unknown as ShanghaiGame['shanghaiRounds'],
      winners: [] as unknown as ShanghaiGame['winners'],
      shanghaiScored: false,
    } as ShanghaiGame);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    const { container } = render(<ShanghaiReport game={mockGame} onNewGame={() => {}} />);
    expect(container).toBeDefined();
  });

  it('displays a single winner correctly', () => {
    const zaphod = { name: 'zaphod', total: 69, mpr: 2 };
    vi.spyOn(mockGame, 'winners', 'get').mockReturnValue([zaphod] as unknown as ShanghaiGame['winners']);
    const { getByText } = render(<ShanghaiReport game={mockGame} onNewGame={vi.fn()} />);
    expect(getByText('Winner:')).toBeDefined();
  });

  it('displays multiple winners correctly', () => {
    const winners = [{ name: 'zaphod' }, { name: 'arthur' }, { name: 'ford' }];
    vi.spyOn(mockGame, 'winners', 'get').mockReturnValue(winners as unknown as ShanghaiGame['winners']);
    const { getByText } = render(<ShanghaiReport game={mockGame} onNewGame={() => {}} />);
    expect(getByText('Winners (tie):')).toBeDefined();
  });

  it('displays players', () => {
    vi.spyOn(mockGame, 'shanghaiPlayers', 'get').mockReturnValue(mockPlayers);
    const { getAllByText } = render(<ShanghaiReport game={mockGame} onNewGame={() => {}} />);

    expect(getAllByText(mockPlayers.at(0)!.name).length).toBeGreaterThan(0);
    expect(getAllByText(mockPlayers.at(1)!.name).length).toBeGreaterThan(0);
    expect(getAllByText(mockPlayers.at(2)!.name).length).toBeGreaterThan(0);
  });

  it('displays shanghai result', () => {
    vi.spyOn(mockGame, 'shanghaiScored', 'get').mockReturnValue(true);
    vi.spyOn(mockGame, 'shanghaiRounds', 'get').mockReturnValue([
      { shanghaiPlayer: mockPlayers[0] },
      { shanghaiPlayer: mockPlayers[1], isShanghai: true },
    ] as unknown as ShanghaiGame['shanghaiRounds']);
    const { getByText } = render(<ShanghaiReport game={mockGame} onNewGame={() => {}} />);
    expect(getByText('Shanghai?')).toBeDefined();
    expect(getByText('Shanghai!')).toBeDefined();
  });
});
