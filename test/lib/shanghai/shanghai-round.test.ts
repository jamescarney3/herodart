import { describe, expect, it, vi } from 'vitest';
import { sum } from 'mathjs';

import ShanghaiRound from '~/lib/shanghai/shanghai-round';

describe('ShanghaiRound class', () => {
  const baseRound = ShanghaiRound.create({ darts: [] });
  const rules = { calculateRoundScore: ({ darts }) => sum(darts) };
  const game = { rules, getWedgeByRound: () => 6 };

  vi.spyOn(baseRound, 'game', 'get').mockReturnValue(game);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('instantiates with props', () => {
    const testDarts = [1, 1, 1];
    const shanghaiRound = ShanghaiRound.create({ darts: testDarts });
    expect(shanghaiRound.darts).toBe(testDarts);
  });

  describe('get marks', () => {
    it('sums darts in a round', () => {
      vi.spyOn(baseRound, 'darts', 'get').mockReturnValue([1, 3, 1]);
      expect(baseRound.marks).toBe(5);
    });
  });

  describe('get score', () => {
    it('returns a score per rules', () => {
      vi.spyOn(baseRound, 'darts', 'get').mockReturnValue([1, 1, 1]);
      expect(baseRound.score).toBe(sum([1, 1, 1]));
    });
  });

  describe('get wedge', () => {
    it('gets wedge from associated game', () => {
      expect(baseRound.wedge).toBe(6);
    });
  });

  describe('get isShanghai', () => {
    it('identifies a scored shanghai', () => {
      expect(baseRound.isShanghai).toBeFalsy();

      vi.spyOn(baseRound, 'darts', 'get').mockReturnValue([1, 2, 3]);
      expect(baseRound.isShanghai).toBeTruthy();
    });
  });
});
