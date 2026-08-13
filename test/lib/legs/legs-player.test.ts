import { describe, expect, it, vi } from 'vitest';

import LegsPlayer from '~/lib/legs/legs-player';
import type LegsGame from '~/lib/legs/legs-game';
import type LegsRound from '~/lib/legs/legs-round';

vi.mock('~/lib/legs/legs-game');
vi.mock('~/lib/legs/legs-round');

describe('LegsPlayer class', () => {
  describe('get strikes', () => {
    it('returns a strike count', () => {
      const legsPlayer = new LegsPlayer();

      vi.spyOn(legsPlayer, 'legsGame', 'get').mockReturnValue({
        calculateStrikes: (player: LegsPlayer) => (player === legsPlayer ? 2 : 0),
      } as LegsGame);

      expect(legsPlayer.strikes).toBe(2);
    });
  });

  describe('get average', () => {
    it('calculates player 3DA', () => {
      const legsPlayer = new LegsPlayer();

      const rounds = [{ score: 60 }, { score: 120 }, { score: 100 }] as LegsRound[];

      vi.spyOn(legsPlayer, 'legsRounds', 'get').mockReturnValue(rounds);

      const total = 60 + 120 + 100;
      const expected = total / 3;
      expect(legsPlayer.average).toBe(expected);
    });
  });

  describe('get opponentAverage', () => {
    it('calculates aggregate preceding player 3DA', () => {
      const legsPlayer = new LegsPlayer();
      const opponentA = new LegsPlayer();
      const opponentB = new LegsPlayer();

      const rounds = [
        { legsPlayer: opponentA, score: 80 },
        { legsPlayer: opponentB, score: 50 },
        { legsPlayer: legsPlayer, score: 100 },
        { legsPlayer: opponentA, score: 60 },
        { legsPlayer: legsPlayer, score: 120 },
      ];

      vi.spyOn(legsPlayer, 'legsGame', 'get').mockReturnValue({ legsRounds: rounds } as LegsGame);

      expect(legsPlayer.opponentAverage).toBe((50 + 60) / 2);
    });
  });

  describe('#score', () => {
    it('scores a legs round', () => {
      const legsPlayer = new LegsPlayer();

      vi.spyOn(legsPlayer, 'legsGame', 'get').mockReturnValue({ scoreRound: vi.fn() } as unknown as LegsGame);

      legsPlayer.score(180);

      expect(legsPlayer.legsGame.scoreRound).toHaveBeenCalledWith(legsPlayer, 180);
    });
  });
});
