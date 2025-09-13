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
