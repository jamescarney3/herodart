import { describe, expect, it, vi, afterEach } from 'vitest';

import LegsPlayer from '~/lib/legs/legs-player';

import Store from '~/lib/store';

vi.mock('~/lib/store', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: {},
  };
});

class MockGame {
  static _storeKey = 'legs-games';
  static _key = 'id';

  constructor(attributes) {
    Object.assign(this, attributes);
  }

  calculateStrikes = vi.fn(() => 3);
  scoreRound = vi.fn();
}

describe('LegsPlayer class', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initializes', () => {
    const player = new LegsPlayer();
    expect(player).toBeTruthy();
  });

  describe('get strikes', () => {
    it('calls game relation method to calculate strikes and returns the result', () => {
      const legsGame = new MockGame({ id: 'testGame' });

      Store._data = {
        'legs-games': {
          find: (id) => {
            if (id === 'testGame') return legsGame;
          }
        },
      };

      const player = new LegsPlayer({ game: legsGame });
      const strikes = player.strikes;

      expect(legsGame.calculateStrikes).toHaveBeenCalledWith(player);
      expect(strikes).toBe(3);
    });

  });

  describe('#score', () => {
    it('calls game relation method to score a round for player instance', () => {
      const legsGame = new MockGame({ id: 'testGame' });

      Store._data = {
        'legs-games': {
          find: (id) => {
            if (id === 'testGame') return legsGame;
          }
        },
      };

      const player = new LegsPlayer({ game: legsGame });
      player.score(180);

      expect(legsGame.scoreRound).toHaveBeenCalledWith(player, 180);
    });
  });
});
