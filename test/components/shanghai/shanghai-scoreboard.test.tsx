import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup, render, fireEvent, waitFor } from '@testing-library/react';

import ShanghaiGame from '~/lib/shanghai/shanghai-game';
import ShanghaiScoreboard from '~/components/shanghai/shanghai-scoreboard';

vi.mock('~/lib/shanghai/shanghai-game', () => {
  const MockShanghaiGame = vi.fn();

  MockShanghaiGame.create = vi.fn().mockImplementation(() => ({
    id: 'test-game',
    currentPlayer: { name: 'amos' },
    currentWedge: null,
    staticPlayerOrder: [{ name: 'amos' }, { name: 'holden' }],
    rounds: [{ player: { name: 'holden' }, darts: [1, 0, 1], wedge: 1 }],
    scoreRound: vi.fn(),
  }));

  return { default: MockShanghaiGame };
});

vi.mock('~/components/shanghai/shanghai-marks', () => {
  const DummyMarks = ({ darts, editing, onSelect }) => (
    <div data-testid="marks">
      <div data-testid="editing-mark">{editing}</div>
      {darts.map((score, idx) => (
        <button data-testid={`dart-${idx}`} key={`marks-${idx}`} onClick={() => onSelect(idx)}>
          {score}
        </button>
      ))}
    </div>
  );
  return { default: DummyMarks };
});

vi.mock('~/components/shanghai/shanghai-round-item', () => {
  const DummyRoundItem = ({ round, editingRound, onClick }) => {
    return (
      <button data-testid={`${round.player.name}-round`} onClick={() => onClick(round)}>
        {editingRound === round && 'editing'}
      </button>
    );
  };
  return { default: DummyRoundItem };
});

describe('ShanghaiScoreboard component', () => {
  let game: ShanghaiGame;
  // scrollIntoView not implemented in jsdom so patch it here - maybe move this to a test setup file
  // in future...
  window.HTMLElement.prototype.scrollIntoView = vi.fn();

  beforeEach(() => {
    game = ShanghaiGame.create();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<ShanghaiScoreboard game={game} />);
    expect(container).toBeDefined();
  });

  it('scores darts', () => {
    const { getByTestId, getByText } = render(<ShanghaiScoreboard game={game} />);

    fireEvent.click(getByText(1));
    fireEvent.click(getByText(2));
    fireEvent.click(getByText(3));

    waitFor(() => {
      expect(getByTestId('dart-1').innerHtml).toBe(1);
      expect(getByTestId('dart-2').innerHtml).toBe(2);
      expect(getByTestId('dart-3').innerHtml).toBe(3);
    });
  });

  it('selects a dart score to edit', () => {
    const { getByTestId, getByText } = render(<ShanghaiScoreboard game={game} />);
    expect(getByTestId('editing-mark').innerHtml).not.toBeDefined();

    waitFor(() => {
      fireEvent.click(getByTestId('dart-1'));
      fireEvent.click(getByTestId('dart-2'));
      expect(getByTestId('editing-mark').innerHtml).not.toBeDefined();

      fireEvent.click(getByText(1));
      fireEvent.click(getByText(2));
      fireEvent.click(getByTestId('dart-1'));
      fireEvent.click(getByTestId('dart-3'));

      expect(getByTestId('editing-mark')).toBe(1);
    });
  });

  it('disables round submission unless all three darts are marked', () => {
    const { getByText } = render(<ShanghaiScoreboard game={game} />);

    expect(getByText('enter').disabled).toBeTruthy();
    fireEvent.click(getByText(1));
    fireEvent.click(getByText(2));
    fireEvent.click(getByText(3));

    waitFor(async () => expect(getByText('enter').disabled).toBeFalsey());
  });

  it('scores a round of shanghai', () => {
    const { getByText } = render(<ShanghaiScoreboard game={game} />);
    const oneButton = getByText(1);
    const missButton = getByText('miss');
    const submitButton = getByText('enter');

    fireEvent.click(oneButton);
    fireEvent.click(missButton);
    fireEvent.click(oneButton);
    fireEvent.click(submitButton);

    waitFor(async () => expect(game.scoreRound).toHaveBeenCalledWith(game.currentPlayer, [1, 0, 1]));
  });

  it('selects a round of shanghai to edit and updates it', () => {
    const { getByTestId, getByText } = render(<ShanghaiScoreboard game={game} />);
    expect(getByTestId('holden-round').innerHtml).not.toBeDefined();

    fireEvent.click(getByTestId('holden-round'));
    waitFor(async () => expect(getByTestId('holden-round').innerHtml).toBeDefined('editing'));

    fireEvent.click(getByTestId('dart-1'));
    fireEvent.click(getByText(3));
    fireEvent.click(getByText('enter'));
    waitFor(async () => expect(getByTestId('holden-round').innerHtml).not.toBeDefined());
  });
});
