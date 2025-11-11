import { describe, expect, it, vi } from 'vitest';

import ShanghaiRound from '~/lib/shanghai/shanghai-round';

describe('ShanghaiRound class', () => {
  it('instantiates with props', () => {
    const testDarts = [1, 1, 1];
    const shanghaiRound = ShanghaiRound.create({ darts: testDarts });

    expect(shanghaiRound.darts).toBe(testDarts);
  });

  describe('get marks', () => {
    it('sums darts in a round', () => {
      const shanghaiRound = new ShanghaiRound();
      shanghaiRound.darts = [2, 3, 1];

      expect(shanghaiRound.marks).toBe(6);
    });
  });

  describe('get wedge', () => {
    it('gets wedge from associated game', () => {
      const shanghaiRound = new ShanghaiRound();
      vi.spyOn(shanghaiRound, 'game', 'get').mockReturnValue({
        getWedgeByRound: vi.fn().mockReturnValue(6),
      });

      expect(shanghaiRound.wedge).toBe(6);
    });
  });

  describe('get isShanghai', () => {
    it('identifies a scored shanghai', () => {
      const shanghaiRound = new ShanghaiRound();
      shanghaiRound.darts = [1, 1, 1];

      expect(shanghaiRound.isShanghai).toBeFalsy();

      shanghaiRound.darts = [1, 2, 3];
      expect(shanghaiRound.isShanghai).toBeTruthy();
    });
  });
});
