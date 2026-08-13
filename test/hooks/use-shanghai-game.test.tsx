import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import { useState } from 'react';

import useShanghaiGame from '~/hooks/use-shanghai-game';

const deleteGame = vi.fn();
const deletePlayer = vi.fn();
const deleteRound = vi.fn();

vi.mock('~/lib/shanghai/shanghai-game', async () => {
  class MockShanghaiGame {
    declare identifier: string;
    declare randomSeed: string;
    declare delete: () => void;
    declare shanghaiRules: object;
    declare shanghaiPlayers: { delete: () => void }[];
    declare shanghaiRounds: { delete: () => void }[];
    static create({ id, shanghaiRules }: { id: string; shanghaiRules: object }) {
      const newGame = new MockShanghaiGame();
      newGame.identifier = 'test game';
      newGame.randomSeed = id;
      newGame.delete = deleteGame;
      newGame.shanghaiPlayers = [{ delete: deletePlayer }];
      newGame.shanghaiRounds = [{ delete: deleteRound }];
      newGame.shanghaiRules = shanghaiRules;
      return newGame;
    }
  }
  return { default: MockShanghaiGame };
});

vi.mock('~/lib/shanghai/shanghai-rules', async () => {
  class MockShanghaiRules {
    declare identifier: string;

    static create() {
      const newRules = new MockShanghaiRules();
      newRules.identifier = 'test rules';
      return newRules;
    }
  }
  return { default: MockShanghaiRules };
});

vi.mock('@jamescarney3/microrm', async (importOriginal) => {
  const actual = await importOriginal();
  class MockObserver {
    // invoke this right away, don't worry about observer inner workings
    static subscribe(callback: () => void) {
      callback();
    }
  }
  return { ...actual!, Observer: MockObserver };
});

describe('useShanghaiGame hook', () => {
  afterEach(() => {
    cleanup();
  });

  const DummyComponent = () => {
    const [testVal, setTestVal] = useState(true);
    const { game, newGame, clearGame } = useShanghaiGame();
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

  it('instantiates and returns a shanghai game', async () => {
    const { container, findByText } = render(<DummyComponent />);
    expect(container).to.exist;
    // TODO: assert correct args passed to game instance
    expect(await findByText('test game')).toBeDefined();
  });

  it('maintains reference to game instance between renders', async () => {
    const { getByTestId, findByTestId } = render(<DummyComponent />);
    const button = await findByTestId('test-val-toggle');
    const firstRenderSeed = getByTestId('random-seed').innerHTML;
    act(() => button.click());
    const secondRenderSeed = getByTestId('random-seed').innerHTML;
    expect(secondRenderSeed).toBe(firstRenderSeed);
  });

  it('returns a newGame callback that begins a new shanghai game', async () => {
    const { getByTestId, findByTestId } = render(<DummyComponent />);
    const button = await findByTestId('new-game-trigger');
    const firstRenderSeed = getByTestId('random-seed').innerHTML;
    act(() => button.click());
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
