import { cleanup, render, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import LegsGame from '~/lib/legs/legs-game';
import LegsSetup from '~/components/legs/setup';

vi.mock('~/lib/legs/legs-game', () => {
  const MockLegsGame = vi.fn();

  MockLegsGame.create = vi.fn().mockImplementation(() => ({
    playerOrder: [],
    start: vi.fn(),
  }));

  return { default: MockLegsGame };
});

describe('LegsSetup', () => {
  let game: LegsGame;

  const startAddingPlayer = (name) => {
    const rendered = render(<LegsSetup game={game} />);
    const { getByText, getByRole } = rendered;

    const addPlayerButton = getByText('add player');
    fireEvent.click(addPlayerButton);

    const enterButton = getByText('enter');
    const cancelButton = getByText('cancel');
    const nameInput = getByRole('textbox');

    if (!name) return { enterButton, cancelButton, nameInput, rendered };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    game = LegsGame.create();
  });

  afterEach(() => {
    cleanup();
  });

  it('initially renders an add player button and a disabled start game button', () => {
    const { getByText } = render(<LegsSetup game={game} />);

    expect(getByText('add player')).toBeTruthy();
    expect(getByText('start game').disabled).toBeTruthy();
  });

  it('starts adding a player on enter press', () => {
    const { nameInput, rendered } = startAddingPlayer();
    const { getAllByRole } = rendered;

    fireEvent.change(nameInput, { target: { value: 'Artemis' } });
    fireEvent.keyUp(nameInput, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(getAllByRole('textbox').length).toBeGreaterThan(1);
  });

  it('adds a player with a splash', async () => {
    const { enterButton, cancelButton, nameInput, rendered } = startAddingPlayer();
    const { getAllByRole, getByText } = rendered;

    expect(nameInput).toBeTruthy();
    expect(cancelButton).toBeTruthy();
    expect(enterButton.disabled).toBeTruthy();

    fireEvent.change(nameInput, { target: { value: 'Artemis' } });
    fireEvent.click(enterButton);

    expect(getAllByRole('textbox').length).toBeGreaterThan(1);
    fireEvent.click(getByText('9'));
    fireEvent.click(getByText('enter'));

    waitFor(() => {
      expect(getByText('add player')).toBeTruthy();
    });
  });

  it('adds a player without a splash', () => {
    const { enterButton, cancelButton, nameInput, rendered } = startAddingPlayer();
    const { getAllByRole, getByText } = rendered;

    expect(nameInput).toBeTruthy();
    expect(cancelButton).toBeTruthy();
    expect(enterButton.disabled).toBeTruthy();

    fireEvent.change(nameInput, { target: { value: 'Artemis' } });
    fireEvent.click(enterButton);

    expect(getAllByRole('textbox').length).toBeGreaterThan(1);
    waitFor(() => {
      fireEvent.click(getByText('enter'));
      expect(getByText('add player')).toBeTruthy();
    });
  });

  it('does not add a player with an invalid splash', () => {
    const { enterButton, cancelButton, nameInput, rendered } = startAddingPlayer();
    const { getAllByRole, getByText } = rendered;

    expect(nameInput).toBeTruthy();
    expect(cancelButton).toBeTruthy();
    expect(enterButton.disabled).toBeTruthy();

    fireEvent.change(nameInput, { target: { value: 'Artemis' } });
    fireEvent.click(enterButton);

    expect(getAllByRole('textbox').length).toBeGreaterThan(1);
    fireEvent.click(getByText('9'));
    fireEvent.click(getByText('+'));
    waitFor(() => {
      fireEvent.click(getByText('enter'));
      expect(getByText('add player')).toBeTruthy();
    });
  });

  it('cancels adding a player', () => {
    const { cancelButton, nameInput, rendered } = startAddingPlayer();
    const { getByText } = rendered;

    fireEvent.change(nameInput, { target: { value: 'Artemis' } });
    fireEvent.click(cancelButton);

    expect(getByText('add player')).toBeTruthy();
    expect(getByText('start game').disabled).toBeTruthy();
  });

  it('starts game when start button is clicked', () => {
    game.canStart = true;
    const { getByText } = render(<LegsSetup game={game} />);
    const startButton = getByText('start game');

    expect(getByText('start game').disabled).toBeFalsy();
    fireEvent.click(startButton);
    expect(game.start).toHaveBeenCalled();
  });
});
