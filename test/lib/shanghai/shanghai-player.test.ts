import { describe, expect, it, afterEach, beforeEach, vi } from 'vitest';

import ShanghaiPlayer from '~/lib/shanghai/shanghai-player';
import { type ShanghaiRound } from '~/lib/shanghai';

describe('ShanghaiPlayer class', () => {
  const basePlayer = ShanghaiPlayer.create({ name: 'james', splash: 110 });
  const calculateRoundScore: (round: ShanghaiRound) => number = vi.fn();
  const playerEliminated: (player: ShanghaiPlayer) => boolean = vi.fn();
  const rules = { playerEliminated, calculateRoundScore };
  vi.mockObject;
  const game = { shanghaiRules: rules };

  beforeEach(() => {
    vi.spyOn(basePlayer, 'shanghaiGame', 'get').mockReturnValue(game as ShanghaiRound['shanghaiGame']);
  });

  afterEach(() => vi.clearAllMocks());

  it('instantiates with props', () => {
    expect(basePlayer.name).toBe('james');
    expect(basePlayer.splash).toBe(110);
  });

  describe('get totalScore', () => {
    vi.spyOn(basePlayer, 'shanghaiRounds', 'get').mockReturnValue([
      { marks: 0 },
      { marks: 3 },
      { marks: 6 },
      { marks: 9 },
    ] as ShanghaiRound[]);

    it('calculates total score per rules', () => {
      vi.spyOn(rules, 'calculateRoundScore').mockImplementation((round: ShanghaiRound) => round.marks);
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
      vi.spyOn(basePlayer, 'shanghaiRounds', 'get').mockReturnValue([
        { marks: 0 },
        { marks: 3 },
        { marks: 6 },
        { marks: 9 },
      ] as ShanghaiRound[]);

      expect(basePlayer.mpr).toBe((0 + 3 + 6 + 9) / 4);
    });

    it('averages marks per round when player threw no rounds', () => {
      const shanghaiPlayer = new ShanghaiPlayer();

      vi.spyOn(shanghaiPlayer, 'shanghaiRounds', 'get').mockReturnValue([]);
      expect(shanghaiPlayer.mpr).toBe(0);
    });
  });

  describe('get missedOnce', () => {
    it('determines if a player has a full round of misses', () => {
      vi.spyOn(basePlayer, 'shanghaiRounds', 'get').mockReturnValue([
        { marks: 1 },
        { marks: 2 },
        { marks: 0 },
      ] as ShanghaiRound[]);
      expect(basePlayer.missedOnce).toBe(true);
    });
  });

  describe('get missedTwice', () => {
    it('determines if a player has 2 full rounds of misses', () => {
      vi.spyOn(basePlayer, 'shanghaiRounds', 'get').mockReturnValue([
        { marks: 1 },
        { marks: 2 },
        { marks: 0 },
        { marks: 0 },
      ] as ShanghaiRound[]);
      expect(basePlayer.missedTwice).toBe(true);
    });
  });
});
