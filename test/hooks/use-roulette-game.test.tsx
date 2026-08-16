import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import useRouletteGame from '~/hooks/use-roulette-game';

vi.mock('~/lib/roulette/roulette-game', () => {
  class RouletteGame {
    declare identifier: string;
    declare randomSeed: string;

    static create() {
      const instance = new this();
      instance.identifier = 'test game';
      instance.randomSeed = uuidv4();
      return instance;
    }
  }
  return { default: RouletteGame };
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

const DummyComponent = () => {
  const [testVal, setTestVal] = useState(true);
  const { game, newGame } = useRouletteGame();

  if (!game) return null;
  return (
    <>
      <div>{game.identifier as string}</div>
      <div data-testid="random-seed">{game.randomSeed as string}</div>
      <button onClick={() => setTestVal(!testVal)} data-testid="test-val-toggle" />
      <button onClick={newGame} data-testid="new-game-trigger" />
    </>
  );
};

describe('useRouletteGame hook', () => {
  it('instantiates and returns a roulette game', () => {
    const { container } = render(<DummyComponent />);
    expect(container).to.exist;
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
});
