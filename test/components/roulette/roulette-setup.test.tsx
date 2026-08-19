import { describe, it, expect, vi } from 'vitest';
import { render, act, fireEvent } from '@testing-library/react';

import RouletteSetup from '~/components/roulette/roulette-setup';
import type RouletteGame from '~/lib/roulette/roulette-game';

describe('RouletteReport component', () => {
  const baseRouletteGame = { roulettePlayers: [], playerOrder: [] } as unknown as RouletteGame;

  it('renders without crashing', () => {
    const container = render(<RouletteSetup game={baseRouletteGame} />);
    expect(container).toBeDefined();
  });

  describe('displaying game data', () => {
    it('displays created roulette players', () => {
      const rouletteGame = {
        ...baseRouletteGame,
        roulettePlayers: [
          { name: 'artemis', keyOrTemporaryKey: 'a' },
          { name: 'freyja', keyOrTemporaryKey: 'f' },
        ] as unknown as RouletteGame['roulettePlayers'],
      } as unknown as RouletteGame;
      const { getByText } = render(<RouletteSetup game={rouletteGame} />);
      expect(getByText('artemis')).toBeDefined();
    });
  });

  describe('creating roulette players', () => {
    it('focuses name input on add button click', async () => {
      const { getByText, getByRole } = render(<RouletteSetup game={baseRouletteGame} />);
      const addPlayerButton = getByText('add player');
      const nameInput = getByRole('textbox') as HTMLInputElement;
      expect(nameInput.disabled).toBe(true);
      act(() => fireEvent.click(addPlayerButton));
      expect(nameInput.disabled).toBe(false);
      expect(nameInput.matches(':focus')).toBe(true);
    });

    it('disables enter button with empty name input', () => {
      const { getByText, getByRole } = render(<RouletteSetup game={baseRouletteGame} />);
      const addPlayerButton = getByText('add player');
      const nameInput = getByRole('textbox') as HTMLInputElement;
      expect(nameInput.disabled).toBe(true);
      act(() => fireEvent.click(addPlayerButton));
      const enterButton = getByText('enter') as HTMLButtonElement;
      expect(enterButton.disabled).toBe(true);
    });

    it('adds player on enter button click or enter press', async () => {
      const rouletteGame = {
        ...baseRouletteGame,
        createPlayer: vi.fn(),
      } as unknown as RouletteGame;

      const { getByText, getByRole } = render(<RouletteSetup game={rouletteGame} />);
      const addPlayerButton = getByText('add player');
      const nameInput = getByRole('textbox') as HTMLInputElement;
      expect(nameInput.disabled).toBe(true);
      act(() => fireEvent.click(addPlayerButton));
      const enterButton = getByText('enter');
      fireEvent.change(nameInput, { target: { value: 'artemis' } });
      act(() => fireEvent.click(enterButton));
      expect(rouletteGame.createPlayer).toHaveBeenCalledWith({ name: 'artemis', ordinality: 1 });
    });

    it('adds player on enter key press', async () => {
      const rouletteGame = {
        ...baseRouletteGame,
        createPlayer: vi.fn(),
      } as unknown as RouletteGame;

      const { getByText, getByRole } = render(<RouletteSetup game={rouletteGame} />);
      const addPlayerButton = getByText('add player');
      const nameInput = getByRole('textbox') as HTMLInputElement;
      act(() => fireEvent.click(addPlayerButton));
      fireEvent.change(nameInput, { target: { value: 'freyja' } });
      fireEvent.keyUp(nameInput, { key: '' });
      fireEvent.keyUp(nameInput, { key: 'Enter', code: 'Enter', charCode: 13 });
      expect(rouletteGame.createPlayer).toHaveBeenCalledWith({ name: 'freyja', ordinality: 1 });
    });

    it('cancels player addition on cancel button click', () => {
      const { getByText, getByRole } = render(<RouletteSetup game={baseRouletteGame} />);
      const addPlayerButton = getByText('add player');
      const nameInput = getByRole('textbox') as HTMLInputElement;
      expect(nameInput.disabled).toBe(true);
      act(() => fireEvent.click(addPlayerButton));
      const cancelButton = getByText('cancel');
      act(() => fireEvent.click(cancelButton));
      expect(nameInput.disabled).toBe(true);
    });
  });

  describe('starting the game', () => {
    it('disables start button when game cannot start', () => {
      const { getByText } = render(<RouletteSetup game={baseRouletteGame} />);
      const startGameButton = getByText('start game') as HTMLButtonElement;
      expect(startGameButton.disabled).toBe(true);
    });

    it('starts game on start button click', () => {
      const rouletteGame = { ...baseRouletteGame, canStart: true, startGame: vi.fn() } as unknown as RouletteGame;
      const { getByText } = render(<RouletteSetup game={rouletteGame} />);
      const startGameButton = getByText('start game') as HTMLButtonElement;
      act(() => fireEvent.click(startGameButton));
      expect(rouletteGame.startGame).toHaveBeenCalled();
    });
  });
});
