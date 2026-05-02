import { describe, expect, it, vi, afterEach } from 'vitest';

import ShanghaiRules, { SCORING, ELIMINATION, TURN_ORDER } from '~/lib/shanghai/shanghai-rules';
import type { ShanghaiRound, ShanghaiPlayer } from '~/lib/shanghai';

describe('ShanghaiRules class', () => {
  const baseRules = ShanghaiRules.create({ id: 'base-rules' });

  afterEach(() => vi.clearAllMocks());

  describe('calculateRoundScore', () => {
    it('calculates score per scoring prop', () => {
      const round = { wedge: 15, marks: 3 } as ShanghaiRound;

      vi.spyOn(baseRules, 'scoring', 'get').mockReturnValue(SCORING.WEDGE);
      expect(baseRules.calculateRoundScore(round)).toBe(45);

      vi.spyOn(baseRules, 'scoring', 'get').mockReturnValue(SCORING.MARKS);
      expect(baseRules.calculateRoundScore(round)).toBe(3);
    });
  });

  describe('playerEliminated', () => {
    it('determines player elimination status per elimination prop', () => {
      vi.spyOn(baseRules, 'elimination', 'get').mockReturnValue(ELIMINATION.SINGLE);
      const playerMissedOnce = { missedOnce: true, missedTwice: false } as ShanghaiPlayer;
      expect(baseRules.playerEliminated(playerMissedOnce)).toBe(true);

      vi.spyOn(baseRules, 'elimination', 'get').mockReturnValue(ELIMINATION.DOUBLE);
      const playerMissedTwice = { missedOnce: true, missedTwice: true } as ShanghaiPlayer;
      expect(baseRules.playerEliminated(playerMissedTwice)).toBe(true);

      vi.spyOn(baseRules, 'elimination', 'get').mockReturnValue(ELIMINATION.DOUBLE);
      const nonEliminationPlayer = { missedOnce: true, missedTwice: true } as ShanghaiPlayer;
      expect(baseRules.playerEliminated(nonEliminationPlayer)).toBe(true);
    });
  });

  describe('generatePlayerOrderCalculator', () => {
    it('generates player order calculate per turn order prop', () => {
      vi.spyOn(baseRules, 'turnOrder', 'get').mockReturnValue(TURN_ORDER.BY_SHOT);
      const calculateShotOrder = baseRules.generatePlayerOrderCalculator({} as ShanghaiPlayer, 95);
      expect(calculateShotOrder()).toBe(95);

      vi.spyOn(baseRules, 'turnOrder', 'get').mockReturnValue(TURN_ORDER.RANDOM);
      const calculateRandomOrder = baseRules.generatePlayerOrderCalculator({} as ShanghaiPlayer);
      expect(typeof calculateRandomOrder()).toBe('number');

      vi.spyOn(baseRules, 'turnOrder', 'get').mockReturnValue(TURN_ORDER.ENTRY);
      const charlie = { name: 'charlie' } as ShanghaiPlayer;
      const mac = { name: 'mac' } as ShanghaiPlayer;
      const dennis = { name: 'dennis' } as ShanghaiPlayer;
      const mockGame = { players: [charlie, mac, dennis] };
      vi.spyOn(baseRules, 'game', 'get').mockReturnValue(mockGame);
      const calculateCharlieOrder = baseRules.generatePlayerOrderCalculator(charlie);
      const calculateMacOrder = baseRules.generatePlayerOrderCalculator(mac);
      expect(calculateMacOrder()).toBeLessThan(calculateCharlieOrder());
    });
  });
});
