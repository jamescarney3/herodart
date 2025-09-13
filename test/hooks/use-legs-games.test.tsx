import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { useState } from 'react';

import useLegsGame from '~/hooks/use-legs-game';

vi.mock('~/lib/legs/legs-game', async () => {
  class MockLegsGame {
    constructor() {
      this.identifier = 'test game';
      this.randomSeed = Math.round(Math.random() * 100000).toString();
    }
  }
  return { default: MockLegsGame };
});

describe.todo('useLegsGame hook', () => {
  afterEach(cleanup);

  const DummyComponent = () => {
    const [testVal, setTestVal] = useState(true);
    const legsGame = useLegsGame();
    return (
      <>
        <div>{legsGame.identifier}</div>
        <div data-testid="random-seed">{legsGame.randomSeed}</div>
        <button onClick={() => setTestVal(!testVal)} data-testid="test-val-toggle" />
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
});
