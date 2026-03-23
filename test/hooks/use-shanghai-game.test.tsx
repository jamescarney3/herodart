import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { useState } from 'react';

import useShanghaiGame from '~/hooks/use-shanghai-game';

vi.mock('~/lib/shanghai/shanghai-game', async () => {
  class MockShanghaiGame {
    static create({ id }) {
      const newGame = new MockShanghaiGame();
      newGame.identifier = 'test game';
      newGame.randomSeed = id;
      newGame.delete = () => void 0;
      newGame.players = [];
      newGame.rounds = [];
      return newGame;
    }
  }
  return { default: MockShanghaiGame };
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

describe('useShanghaiGame hook', () => {
  afterEach(cleanup);

  const DummyComponent = () => {
    const [testVal, setTestVal] = useState(true);
    const { game, newGame } = useShanghaiGame();
    if (!game) return null;
    return (
      <>
        <div>{game.identifier}</div>
        <div data-testid="random-seed">{game.randomSeed}</div>
        <button onClick={() => setTestVal(!testVal)} data-testid="test-val-toggle" />
        <button onClick={newGame} data-testid="new-game-trigger" />
      </>
    );
  };

  it('instantiates and returns a legs game', () => {
    const { container } = render(<DummyComponent />);
    expect(container).to.exist;
    // TODO: assert correct args passed to game instance
    expect(screen.getByText('test game')).to.exist;
  });

  it('maintains reference to game instance between renders', () => {
    render(<DummyComponent />);
    const button = screen.getByTestId('test-val-toggle');
    const firstRenderSeed = screen.getByTestId('random-seed').innerHTML;
    button.click();
    const secondRenderSeed = screen.getByTestId('random-seed').innerHTML;
    expect(secondRenderSeed).toBe(firstRenderSeed);
  });

  it('returns a newGame callback that begins a new legs game', async () => {
    const { getByTestId } = render(<DummyComponent />);
    const button = getByTestId('new-game-trigger');
    const firstRenderSeed = getByTestId('random-seed').innerHTML;
    button.click();
    await waitFor(() => {
      const secondRenderSeed = getByTestId('random-seed').innerHTML;
      expect(secondRenderSeed).not.toBe(firstRenderSeed);
    });
  });
});
