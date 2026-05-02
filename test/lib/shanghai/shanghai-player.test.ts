import { describe, expect, it, afterEach, vi } from 'vitest';

import ShanghaiPlayer from '~/lib/shanghai/shanghai-player';

describe('ShanghaiPlayer class', () => {
  const basePlayer = ShanghaiPlayer.create({ name: 'james', splash: 110 });
  const rules = {
    playerEliminated: () => {},
    calculateRoundScore: () => {},
  };
  const game = { rules };

  beforeEach(() => {
    vi.spyOn(basePlayer, 'game', 'get').mockReturnValue(game);
  });

  afterEach(() => vi.clearAllMocks());

  it('instantiates with props', () => {
    expect(basePlayer.name).toBe('james');
    expect(basePlayer.splash).toBe(110);
  });

  describe('get totalScore', () => {
    vi.spyOn(basePlayer, 'rounds', 'get').mockReturnValue([{ marks: 0 }, { marks: 3 }, { marks: 6 }, { marks: 9 }]);

    it('calculates total score per rules', () => {
      vi.spyOn(rules, 'calculateRoundScore').mockImplementation((round) => round.marks);
      expect(basePlayer.totalScore).toBe(18);
    });
  });

  describe('get eliminated', () => {
    it('determines elimination status per rules', () => {
      vi.spyOn(rules, 'playerEliminated').mockImplementation(() => true);
      expect(basePlayer.eliminated).toBe(true);

      vi.spyOn(rules, 'playerEliminated').mockImplementation(() => false);
      expect(basePlayer.eliminated).toBe(false);
    });
  });

  describe('get mpr', () => {
    it('averages marks per round', () => {
      vi.spyOn(basePlayer, 'rounds', 'get').mockReturnValue([{ marks: 0 }, { marks: 3 }, { marks: 6 }, { marks: 9 }]);

      expect(basePlayer.mpr).toBe((0 + 3 + 6 + 9) / 4);
    });

    it('averages marks per round when player threw no rounds', () => {
      const shanghaiPlayer = new ShanghaiPlayer();

      vi.spyOn(shanghaiPlayer, 'rounds', 'get').mockReturnValue([]);
      expect(shanghaiPlayer.mpr).toBe(0);
    });
  });

  describe('get missedOnce', () => {
    it('determines if a player has a full round of misses', () => {
      vi.spyOn(basePlayer, 'rounds', 'get').mockReturnValue([{ marks: 1 }, { marks: 2 }, { marks: 0 }]);
      expect(basePlayer.missedOnce).toBe(true);
    });
  });

  describe('get missedTwice', () => {
    it('determines if a player has 2 full rounds of misses', () => {
      vi.spyOn(basePlayer, 'rounds', 'get').mockReturnValue([{ marks: 1 }, { marks: 2 }, { marks: 0 }, { marks: 0 }]);
      expect(basePlayer.missedTwice).toBe(true);
    });
  });
});
