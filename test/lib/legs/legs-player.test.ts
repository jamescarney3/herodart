import { describe, expect, it, vi } from 'vitest';

import LegsPlayer from '~/lib/legs/legs-player';

vi.mock('~/lib/legs/legs-game', () => {
  class MockGame {
    static create = vi.fn().mockImplementation(() => 'extant round');
  }

  return { default: MockGame };
});

describe('LegsPlayer class', () => {
  describe('get strikes', () => {
    it('returns a strike count', () => {
      const legsPlayer = new LegsPlayer({ id: 'testPlayer' });

      vi.spyOn(legsPlayer, 'game', 'get').mockReturnValue({
        calculateStrikes: vi.fn().mockReturnValue(2),
      });

      expect(legsPlayer.strikes).toBe(2);
      expect(legsPlayer.game.calculateStrikes).toHaveBeenCalledWith(legsPlayer);
    });
  });

  describe('get average', () => {
    it('calculates player 3DA', () => {
      const legsPlayer = new LegsPlayer({ name: 'moe' });

      const rounds = [
        { score: 60 },
        { score: 120 },
        { score: 100 },
      ];

      vi.spyOn(legsPlayer, 'rounds', 'get').mockReturnValue(rounds);

      const total = 60 + 120 + 100;
      const expected = total / 3;
      expect(legsPlayer.average).toBe(expected);
    });
  });

  describe('get opponentAverage', () => {
    it('calculates aggregate preceding player 3DA', () => {
      const legsPlayer = new LegsPlayer({ name: 'larry' });
      const opponentA = { name: 'curly' };
      const opponentB = { name: 'shemp' };

      const rounds = [
        { player: opponentA, score: 80 },
        { player: opponentB, score: 50 },
        { player: legsPlayer, score: 100 },
        { player: opponentA, score: 60 },
        { player: legsPlayer, score: 120 },
      ];

      vi.spyOn(legsPlayer, 'game', 'get').mockReturnValue({ rounds });

      expect(legsPlayer.opponentAverage).toBe((50 + 60) / 2);
    });
  });

  describe('#score', () => {
    it('scores a legs round', () => {
      const legsPlayer = new LegsPlayer({ id: 'testPlayer' });

      vi.spyOn(legsPlayer, 'game', 'get').mockReturnValue({
        scoreRound: vi.fn(),
      });

      legsPlayer.score(180);

      expect(legsPlayer.game.scoreRound).toHaveBeenCalledWith(legsPlayer, 180);
    });
  });
});
