import { cleanup, render, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import LegsGame from '~/lib/legs/legs-game';
import LegsScoreboard from '~/components/legs/scoreboard';

vi.mock('~/lib/legs/legs-game', () => {
  const MockLegsGame = vi.fn();

  MockLegsGame.create = vi.fn().mockImplementation(() => ({
    id: 'test-game',
    targetScore: 0,
    currentPlayer: null,
    playerOrder: [],
    start: vi.fn(),
    scoreWouldEliminateCurrentPlayer: vi.fn().mockReturnValue(false),
    scoreWouldBeStrike: vi.fn().mockReturnValue(false),
    createPlayer: vi.fn().mockImplementation(({ name, splash }) => ({
      name,
      splash,
      score: vi.fn(),
      strikes: 0,
    })),
  }));

  return { default: MockLegsGame };
});

describe('LegsScoreboard', () => {
  let game: LegsGame;

  beforeEach(() => {
    vi.clearAllMocks();
    game = LegsGame.create();

    // Setup mock player order
    const player1 = game.createPlayer({ name: 'Player 1', splash: 100 });
    const player2 = game.createPlayer({ name: 'Player 2', splash: 90 });
    game.playerOrder = [player1, player2];
    game.currentPlayer = player1;

    game.start();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the target score and player cards for all players', () => {
    const { container, getByText } = render(<LegsScoreboard game={game} />);

    expect(getByText('Target:')).toBeTruthy();
    expect(container.querySelector('h1 + div').textContent).toBe('0');
    game.playerOrder.forEach((player) => expect(getByText(player.name)).toBeTruthy());
  });

  it('displays player cards for all players', () => {
    const { getByText } = render(<LegsScoreboard game={game} />);
    const player1Name = getByText('Player 1');
    const player2Name = getByText('Player 2');

    expect(player1Name).toBeDefined();
    expect(player2Name).toBeDefined();
  });

  it('updates score when keypad is used', () => {
    const { getByText, getAllByDisplayValue } = render(<LegsScoreboard game={game} />);

    fireEvent.click(getByText('1'));
    fireEvent.click(getByText('2'));
    fireEvent.click(getByText('3'));

    const input = getAllByDisplayValue('123');
    expect(input.length).toBeGreaterThan(0);
  });

  it('submits score when enter is pressed', async () => {
    vi.useFakeTimers();
    const { getByText, getAllByDisplayValue } = render(<LegsScoreboard game={game} />);

    fireEvent.click(getByText('5'));
    fireEvent.click(getByText('1'));
    fireEvent.click(getByText('enter'));

    const pendingInput = getAllByDisplayValue('51');
    expect(pendingInput).toBeDefined();

    await act(async () => {
      vi.runAllTimers();
    });

    const clearedInput = getAllByDisplayValue('');
    expect(clearedInput).toBeDefined();
    expect(game.currentPlayer.score).toHaveBeenCalledWith(51);

    vi.useRealTimers();
  });

  it('handles mathematical expressions in score input', async () => {
    vi.useFakeTimers();
    const { getByText } = render(<LegsScoreboard game={game} />);

    fireEvent.click(getByText('1'));
    fireEvent.click(getByText('2'));
    fireEvent.click(getByText('+'));
    fireEvent.click(getByText('3'));
    fireEvent.click(getByText('4'));
    fireEvent.click(getByText('enter'));

    await act(async () => {
      vi.runAllTimers();
    });

    expect(game.currentPlayer.score).toHaveBeenCalledWith(46);

    vi.useRealTimers();
  });
});
