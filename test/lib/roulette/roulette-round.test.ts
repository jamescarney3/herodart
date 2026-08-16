import { describe, it, expect } from 'vitest';

import RouletteRound from '~/lib/roulette/roulette-round';

describe('RouletteRound class', () => {
  it('instantiates with props', () => {
    const testScore = 180;

    const round = RouletteRound.create({ score: testScore });

    expect(round.score).toBe(180);
  });
});
