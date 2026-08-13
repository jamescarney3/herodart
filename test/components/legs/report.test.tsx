import { describe, it, afterEach, expect, beforeEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import * as rt from '@testing-library/react';
import LegsReport from '~/components/legs/report';
import LegsGame from '~/lib/legs/legs-game';
import LegsRound from '~/lib/legs/legs-round';
import LegsPlayer from '~/lib/legs/legs-player';

// Mock the models
vi.mock('~/lib/legs/legs-game');
vi.mock('~/lib/legs/legs-round');
vi.mock('~/lib/legs/legs-player');

describe('LegsReport', () => {
  let mockGame: LegsGame;
  let mockPlayers: LegsPlayer[];
  let mockRounds: LegsRound[];

  beforeEach(() => {
    mockPlayers = [
      {
        name: 'Player 1',
        legsRounds: [],
        average: 85.5,
        opponentAverage: 75.2,
        splash: 100,
      },
      {
        name: 'Player 2',
        legsRounds: [],
        average: 72.3,
        opponentAverage: 85.6,
        splash: 90,
      },
    ] as unknown as LegsPlayer[];

    mockRounds = [
      {
        legsPlayer: mockPlayers[0],
        score: 100,
        wasStrike: false,
        wasEliminationRound: false,
      },
      {
        legsPlayer: mockPlayers[1],
        score: 80,
        wasStrike: true,
        wasEliminationRound: false,
      },
      {
        legsPlayer: mockPlayers[1],
        score: 60,
        wasStrike: true,
        wasEliminationRound: true,
      },
    ] as unknown as LegsRound[];

    mockGame = {
      winner: mockPlayers[0],
      legsPlayers: mockPlayers,
      legsRounds: mockRounds,
    } as unknown as LegsGame;
  });

  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    const { container } = render(<LegsReport game={mockGame} onNewGame={() => {}} />);
    expect(container).toBeDefined();
  });

  it('displays winning player', () => {
    const { getByText, getAllByText } = render(<LegsReport game={mockGame} onNewGame={() => {}} />);
    expect(getByText('Winner:')).toBeDefined();
    expect(getAllByText('Player 1').length).toBeGreaterThan(0);
    expect(getByText('Average: 85.5')).toBeDefined();
    expect(getByText('Opp. Average: 75.2')).toBeDefined();
  });

  it('renders player performance table with averages', () => {
    const { getAllByRole } = render(<LegsReport game={mockGame} onNewGame={() => {}} />);
    const perfTable = getAllByRole('table')[0];
    const rows = rt.getAllByRole(perfTable, 'row');

    // Header + 2 players
    expect(rows).toHaveLength(3);

    // Check player data is displayed
    expect(rt.getByText(perfTable, '85.5')).toBeDefined();
    expect(rt.getByText(perfTable, '72.3')).toBeDefined();
  });

  it('renders game log with all rounds', () => {
    const { getAllByRole } = render(<LegsReport game={mockGame} onNewGame={() => {}} />);
    const roundsLogTable = getAllByRole('table')[1];
    const rows = rt.getAllByRole(roundsLogTable, 'row');

    // header + 3 rounds
    expect(rows).toHaveLength(4);

    // Check round data
    expect(rt.getByText(roundsLogTable, '100')).toBeDefined();
    expect(rt.getByText(roundsLogTable, '80')).toBeDefined();
    expect(rt.getByText(roundsLogTable, '60')).toBeDefined();
  });
});
