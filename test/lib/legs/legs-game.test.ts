import { describe, expect, it, vi, afterEach } from 'vitest';

import LegsGame from '~/lib/legs/legs-game';
import LegsPlayer from '~/lib/legs/legs-player';
import LegsRound from '~/lib/legs/legs-round';

vi.mock('~/lib/legs/legs-player', () => {
  class MockPlayer {
    static create = vi.fn().mockImplementation(() => 'extant player');
  }

  return { default: MockPlayer };
});

vi.mock('~/lib/legs/legs-round', () => {
  class MockRound {
    static create = vi.fn().mockImplementation(() => 'extant round');
  }

  return { default: MockRound };
});

describe('LegsGame class', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('isntantiates', () => {
    const legsGame = new LegsGame();
    expect(legsGame).toBeTruthy();
  });

  describe('#createPlayer', () => {
    it('instantiates and returns a legs player ', () => {
      const legsGame = new LegsGame({ id: 'testGame' });
      const player = legsGame.createPlayer({});

      expect(LegsPlayer.create).toHaveBeenCalledWith({ game: legsGame });
      expect(player).toBeTruthy();
    });
  });

  describe('#start', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('starts game', () => {
      const legsGame = new LegsGame({ id: 'testGame' });
      expect(() => legsGame.start()).toThrowError();

      vi.spyOn(legsGame, 'players', 'get').mockReturnValue([{}, {}]);

      legsGame.start();
      expect(legsGame.started).toBe(true);
    });

    it('throws when not enough players', () => {
      const legsGame = new LegsGame({ id: 'testGame' });
      expect(() => legsGame.start()).toThrowError();

      vi.spyOn(legsGame, 'players', 'get').mockReturnValue([{}]);

      expect(() => legsGame.start()).toThrowError();
    });
  });

  describe('#scoreRound', () => {
    it('scores a round for a player', () => {
      LegsPlayer.create = vi.fn().mockImplementation(() => ({}));
      const mockPlayer = LegsPlayer.create();
      LegsRound.create = vi.fn().mockImplementation(() => ({}));

      const legsGame = new LegsGame({ id: 'testGame' });

      vi.spyOn(legsGame, 'players', 'get').mockReturnValue([mockPlayer]);

      legsGame.scoreRound(mockPlayer, 180);
      expect(LegsRound.create).toHaveBeenCalledWith({ game: legsGame, player: mockPlayer, score: 180 });
    });
  });

  describe('#calculateStrikes', () => {
    it('calculates strikes for player', () => {
      const legsGame = new LegsGame();
      legsGame.id = 'legs-game-1';

      const player1 = {};
      const player2 = {};

      vi.spyOn(legsGame, 'players', 'get').mockReturnValue([player1, player2]);
      vi.spyOn(legsGame, 'rounds', 'get').mockReturnValue([
        { score: 60, player: player1 },
        { score: 26, player: player2 },
        { score: 60, player: player1 },
        { score: 26, player: player2 },
        { score: 60, player: player1 },
        { score: 26, player: player2 },
      ]);

      expect(legsGame.calculateStrikes(player1)).toBe(0);
      expect(legsGame.calculateStrikes(player2)).toBe(3);
    });
  });

  describe('get finished', () => {
    it('returns true for started game with 1 remaining player', () => {
      const legsGame = new LegsGame({ id: 'testGame' });
      vi.spyOn(legsGame, 'players', 'get').mockReturnValue([
        { strikes: 0 },
        { strikes: 1 },
        { strikes: 2 },
        { strikes: 3 },
      ]);
      expect(legsGame.finished).toBe(false);

      legsGame.started = true;
      expect(legsGame.finished).toBe(false);

      vi.spyOn(legsGame, 'players', 'get').mockReturnValue([
        { strikes: 0 },
        { strikes: 3 },
        { strikes: 3 },
        { strikes: 3 },
      ]);
      expect(legsGame.finished).toBe(true);
    });
  });

  describe('get playerOrder', () => {
    it('returns non-eliminated players ordered by splash', () => {
      const player10 = { splash: 10, strikes: 0 };
      const player30 = { splash: 30, strikes: 0 };
      const player50 = { splash: 50, strikes: 0 };
      const player40 = { splash: 40, strikes: 0 };
      const player20 = { splash: 20, strikes: 0 };

      const legsGame = new LegsGame({ id: 'testGame' });

      vi.spyOn(legsGame, 'players', 'get').mockReturnValue([player10, player30, player50, player40, player20]);
      vi.spyOn(legsGame, 'rounds', 'get').mockReturnValue([]);

      expect(legsGame.playerOrder).toEqual([player50, player40, player30, player20, player10]);

      vi.spyOn(legsGame, 'rounds', 'get').mockReturnValue({ last: { player: player40 } });
      expect(legsGame.playerOrder).toEqual([player30, player20, player10, player50, player40]);

      vi.spyOn(legsGame, 'rounds', 'get').mockReturnValue({ last: { player: player10 } });
      expect(legsGame.playerOrder).toEqual([player50, player40, player30, player20, player10]);

      player50.strikes = 3;
      player20.strikes = 3;
      expect(legsGame.playerOrder).toEqual([player40, player30, player10]);
    });
  });

  describe('get targetScore', () => {
    it('returns score of last round or 0', () => {
      const legsGame = new LegsGame({ id: 'testGame' });
      vi.spyOn(legsGame, 'rounds', 'get').mockReturnValue([]);

      expect(legsGame.targetScore).toBe(0);

      vi.spyOn(legsGame, 'rounds', 'get').mockReturnValue({ last: { score: 26 } });

      expect(legsGame.targetScore).toBe(26);
    });
  });

  describe('get currentPlayer', () => {
    it('returns next active player in order of splash starting after last round and wrapping', () => {
      const legsGame = new LegsGame({ id: 'testGame' });
      const firstPlayer = {};

      vi.spyOn(legsGame, 'playerOrder', 'get').mockReturnValue({ first: firstPlayer });

      expect(legsGame.currentPlayer).toBe(firstPlayer);
    });
  });

  describe('get canStart', () => {
    it('returns true when game has enough players and is not finished', () => {
      const game = new LegsGame();

      vi.spyOn(game, 'players', 'get').mockReturnValue([]);
      expect(game.canStart).toBe(false);
      game.players.push('James');
      expect(game.canStart).toBe(false);
      game.players.push('Scott');
      expect(game.canStart).toBe(true);
      vi.spyOn(game, 'finished', 'get').mockReturnValue(true);
      expect(game.canStart).toBe(false);
    });
  });

  describe('playerExistsWithName', () => {
    it('returns true when player exists with given name and false when one does not', () => {
      const game = new LegsGame();

      // Mock the players collection
      vi.spyOn(game, 'players', 'get').mockReturnValue([{ name: 'James' }, { name: 'Matt' }]);

      expect(game.playerExistsWithName('James')).toBe(true);
      expect(game.playerExistsWithName('Maloof')).toBe(false);
    });
  });
});
