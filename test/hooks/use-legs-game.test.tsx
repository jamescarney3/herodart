import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { useState } from 'react';

import useLegsGame from '~/hooks/use-legs-game';

const deleteGame = vi.fn();
const deletePlayer = vi.fn();
const deleteRound = vi.fn();

vi.mock('~/lib/legs/legs-game', () => {
  class MockLegsGame {
    declare identifier: string;
    declare randomSeed: string;
    declare delete: () => void;
    declare legsPlayers: { delete: () => void }[];
    declare legsRounds: { delete: () => void }[];

    static create({ id }: { id: string }) {
      const newGame = new MockLegsGame();
      newGame.identifier = 'test game';
      newGame.randomSeed = id;
      newGame.delete = deleteGame;
      newGame.legsPlayers = [{ delete: deletePlayer }];
      newGame.legsRounds = [{ delete: deleteRound }];
      return newGame;
    }
  }
  return { default: MockLegsGame };
});

vi.mock('@jamescarney3/microrm', () => {
  class MockObserver {
    // invoke this right away, don't worry about observer inner workings
    static subscribe(callback: () => void) {
      callback();
    }
  }
  return { Observer: MockObserver };
});

describe('useLegsGame hook', () => {
  afterEach(cleanup);

  const DummyComponent = () => {
    const [testVal, setTestVal] = useState(true);
    const { game, newGame, clearGame } = useLegsGame();
    if (!game) return null;
    return (
      <>
        <div>{game.identifier as string}</div>
        <div data-testid="random-seed">{game.randomSeed as string}</div>
        <button onClick={() => setTestVal(!testVal)} data-testid="test-val-toggle" />
        <button onClick={newGame} data-testid="new-game-trigger" />
        <button onClick={clearGame} data-testid="clear-game-trigger" />
      </>
    );
  };

  it('instantiates and returns a legs game', () => {
    const { container } = render(<DummyComponent />);
    expect(container).to.exist;
    // TODO: assert correct args passed to game instance
    expect(screen.getByText('test game')).to.exist;
  });

  it('maintains reference to game instance between renders', async () => {
    const { getByTestId, findByTestId } = render(<DummyComponent />);
    const button = await findByTestId('test-val-toggle');
    const firstRenderSeed = screen.getByTestId('random-seed').innerHTML;
    await act(async () => button.click());
    const secondRenderSeed = getByTestId('random-seed').innerHTML;
    expect(secondRenderSeed).toBe(firstRenderSeed);
  });

  it('returns a newGame callback that begins a new legs game', async () => {
    const { getByTestId, findByTestId } = render(<DummyComponent />);
    const button = await findByTestId('new-game-trigger');
    const firstRenderSeed = getByTestId('random-seed').innerHTML;
    await act(async () => button.click());
    const secondRenderSeed = getByTestId('random-seed').innerHTML;
    expect(secondRenderSeed).not.toBe(firstRenderSeed);
  });

  it('returns a clearGame callback that deletes game and associated models', async () => {
    const { findByTestId } = render(<DummyComponent />);
    const button = await findByTestId('clear-game-trigger');
    await act(async () => button.click());
    expect(deleteGame).toHaveBeenCalled();
    expect(deletePlayer).toHaveBeenCalled();
    expect(deleteRound).toHaveBeenCalled();
  });
});
