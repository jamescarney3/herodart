import { describe, expect, it, vi } from 'vitest';

import ShanghaiPlayer from '~/lib/shanghai/shanghai-player';

describe('ShanghaiPlayer class', () => {
  it('instantiates with props', () => {
    const shanghaiPlayer = ShanghaiPlayer.create({
      name: 'james',
      splash: 110,
    });

    expect(shanghaiPlayer.name).toBe('james');
    expect(shanghaiPlayer.splash).toBe(110);
  });

  describe('get mpr', () => {
    it('averages marks per round', () => {
      const shanghaiPlayer = new ShanghaiPlayer();

      vi.spyOn(shanghaiPlayer, 'rounds', 'get').mockReturnValue([
        { marks: 0 },
        { marks: 3 },
        { marks: 6 },
        { marks: 9 },
      ]);

      expect(shanghaiPlayer.mpr).toBe((0 + 3 + 6 + 9) / 4);
    });
  });

  describe('#score', () => {
    it('scores darts to round in associated game', () => {
      const shanghaiPlayer = new ShanghaiPlayer();
      vi.spyOn(shanghaiPlayer, 'game', 'get').mockReturnValue({ scoreRound: vi.fn() });

      const darts = [1, 2, 2];
      shanghaiPlayer.score(darts);

      expect(shanghaiPlayer.game.scoreRound).toHaveBeenCalledWith(shanghaiPlayer, darts);
    });
  });
});
