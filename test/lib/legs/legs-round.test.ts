import { describe, expect, it, vi } from 'vitest';

import LegsRound from '~/lib/legs/legs-round';

describe('LegsRound class', () => {
  it('instantiates with props', () => {
    const testScore = 180;

    const legsRound = LegsRound.create({ score: testScore });

    expect(legsRound.score).toBe(180);
  });

  describe('#wasStrike', () => {
    it('returns true when round score is lower than the previous', () => {
      const rounds = [
        LegsRound.create({ score: 100 }),
        LegsRound.create({ score: 60 }),
        LegsRound.create({ score: 120 }),
      ];
      rounds.forEach((round) => {
        vi.spyOn(round, 'game', 'get').mockReturnValue({ rounds });
      });

      // expect(rounds[0].wasStrike).toBe(false); // no previous
      expect(rounds[1].wasStrike).toBe(true);  // 60 < 100
      expect(rounds[2].wasStrike).toBe(false); // 120 > 60
    });
  });

  describe('#wasEliminationRound', () => {
    it('returns true when round score is player\'s third strike', () => {
      const playerA = { name: 'wile e coyote' };
      const playerB = { name: 'road runner' };

      const rounds = [
        LegsRound.create({ score: 100 }),
        LegsRound.create({ score: 90 }),
        LegsRound.create({ score: 80 }),
        LegsRound.create({ score: 85 }),
        LegsRound.create({ score: 70 }),
        LegsRound.create({ score: 75 }),
        LegsRound.create({ score: 65 }),
      ];

      rounds.forEach((round, idx) => {
        vi.spyOn(round, 'player', 'get').mockReturnValue(idx % 2 ? playerA : playerB);
      });

      rounds.forEach((round) => {
        vi.spyOn(round, 'game', 'get').mockReturnValue({ rounds });
      });

      // rounds[6] should be elimination round for playerA
      expect(rounds[6].wasEliminationRound).toBe(true);

      // earlier playerA rounds should not yet be elimination rounds
      expect(rounds[2].wasEliminationRound).toBe(false);
      expect(rounds[4].wasEliminationRound).toBe(false);
    });
  });
});
