import { describe, expect, it } from 'vitest';

import LegsRound from '~/lib/legs/legs-round';

describe('LegsRound class', () => {
  it('initializes', () => {
    const player = { name: 'foo' };
    const round = new LegsRound({ player, score: 180 });
    expect(round).toBeTruthy();
  });
});
