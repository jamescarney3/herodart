import { describe, expect, it } from 'vitest';

import LegsRound from '~/lib/legs/legs-round';

describe('LegsRound class', () => {
  it('instantiates with props', () => {
    const testScore = 180;

    const legsRound = new LegsRound({ score: testScore });

    expect(legsRound.score).toBe(180);
  });
});
