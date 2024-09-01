import { describe, expect, it, vi, afterEach } from 'vitest';

import LegsGame from '~/lib/legs/legs-game';

import Store from '~/lib/store';
import Collection from '~/lib/collection';
import LegsPlayer from '~/lib/legs/legs-player';
import LegsRound from '~/lib/legs/legs-round';

vi.mock('~/lib/store', async (importOriginal) => {
  const actual = await importOriginal();
  const storeData = {
    'legs-players': [],
    'legs-rounds': [],
  };
  const MockStore = { _data: storeData };
  return { ...actual, default: MockStore };
});

vi.mock('~/lib/collection', async (importOriginal) => {
  const actual = await importOriginal();
  class MockCollection extends Array {
    constructor(data) {
      super(data.length);
      this.splice(0, data.length, ...data);
    }

    get first() {
      return this[0];
    }

    get last() {
      return this.slice(-1)[0];
    }
  }

  return { ...actual, defualt: MockCollection };
});

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
    it('throws when not enough players', () => {
      const legsGame = new LegsGame({ id: 'testGame' });
      expect(() => legsGame.start()).toThrowError();

      Store._data['legs-players'].filter = vi.fn().mockImplementation(() => [{}, {}]);
      legsGame.start();

      expect(legsGame.started).toBe(true);
    });
  });

  describe('#scoreRound', () => {
    it('scores a round for a player', () => {
      LegsPlayer.create = vi.fn().mockImplementation(() => ({}));
      const mockPlayer = LegsPlayer.create();
      Store._data['legs-players'].get = vi.fn().mockImplementation(() => mockPlayer);

      const legsGame = new LegsGame({ id: 'testGame' });
      legsGame.scoreRound(mockPlayer, 180);

      expect(LegsRound.create).toHaveBeenCalledWith({ game: legsGame, player: mockPlayer, score: 180 });
    });
  });

  describe('#calculateStrikes', () => {
    it('calculates strikes for player', () => {
      const legsGame = new LegsGame({ id: 'testGame' });

      LegsPlayer.create = vi.fn().mockImplementation(() => ({}));
      const mockPlayer1 = LegsPlayer.create();
      const mockPlayer2 = LegsPlayer.create();
      const mockPlayer3 = LegsPlayer.create();

      LegsRound.create = vi.fn().mockImplementation(({ score, player }) => ({ score, player, _gameId: 'testGame' }));
      const player1Round1 = LegsRound.create({ player: mockPlayer1, score: 41 });
      const player2Round2 = LegsRound.create({ player: mockPlayer2, score: 41 });
      const player3Round3 = LegsRound.create({ player: mockPlayer3, score: 26 });
      const player1Round4 = LegsRound.create({ player: mockPlayer1, score: 41 });
      const player2Round5 = LegsRound.create({ player: mockPlayer2, score: 26 });
      const player3Round6 = LegsRound.create({ player: mockPlayer3, score: 41 });
      const player1Round7 = LegsRound.create({ player: mockPlayer1, score: 41 });
      const player2Round8 = LegsRound.create({ player: mockPlayer2, score: 26 });

      Store._data['legs-rounds'] = [
        player1Round1,
        player2Round2,
        player3Round3,
        player1Round4,
        player2Round5,
        player3Round6,
        player1Round7,
        player2Round8,
      ];

      expect(legsGame.calculateStrikes(mockPlayer1)).toBe(0);
      expect(legsGame.calculateStrikes(mockPlayer2)).toBe(2);
      expect(legsGame.calculateStrikes(mockPlayer3)).toBe(1);
    });
  });

  describe('get finished', () => {
    it('returns true for started game with 1 remaining player', () => {
      const legsGame = new LegsGame({ id: 'testGame' });
      expect(legsGame.finished).toBe(false);

      legsGame.started = true;
      const unfinishedPlayers = [
        { strikes: 0, _gameId: 'testGame' },
        { strikes: 1, _gameId: 'testGame' },
        { strikes: 2, _gameId: 'testGame' },
        { strikes: 3, _gameId: 'testGame' },
      ];
      Store._data['legs-players'] = unfinishedPlayers;
      expect(legsGame.finished).toBe(false);

      const finishedPlayers = [
        { strikes: 0, _gameId: 'testGame' },
        { strikes: 3, _gameId: 'testGame' },
        { strikes: 3, _gameId: 'testGame' },
        { strikes: 3, _gameId: 'testGame' },
      ];
      Store._data['legs-players'] = finishedPlayers;
      expect(legsGame.finished).toBe(true);
    });
  });

  describe('get playerOrder', () => {
    it('returns non-eliminated players ordered by splash', () => {
      const player10 = { splash: 10, strikes: 0, _gameId: 'testGame' };
      const player30 = { splash: 30, strikes: 0, _gameId: 'testGame' };
      const player50 = { splash: 50, strikes: 0, _gameId: 'testGame' };
      const player20 = { splash: 20, strikes: 0, _gameId: 'testGame' };
      const player40 = { splash: 40, strikes: 0, _gameId: 'testGame' };
      const players = new Collection([player10, player30, player50, player20, player40]);
      Store._data['legs-players'] = players;

      const legsGame = new LegsGame({ id: 'testGame' });
      expect(legsGame.playerOrder).toEqual([player50, player40, player30, player20, player10]);

      Store._data['legs-rounds'].filter = vi.fn().mockReturnValue({ last: { player: player40 } });
      expect(legsGame.playerOrder).toEqual([player30, player20, player10, player50, player40]);

      Store._data['legs-rounds'].filter = vi.fn().mockReturnValue({ last: { player: player10 } });
      expect(legsGame.playerOrder).toEqual([player50, player40, player30, player20, player10]);

      Store._data['legs-rounds'].filter.mockReset();
      player50.strikes = 3;
      player20.strikes = 3;
      expect(legsGame.playerOrder).toEqual([player40, player30, player10]);
    });
  });

  describe('get targetScore', () => {
    it('returns score of last round or 0', () => {
      const emptyMockRounds = new Collection([]);
      Store._data['legs-rounds'].filter = vi.fn().mockImplementation(() => emptyMockRounds);

      const legsGame = new LegsGame({ id: 'testGame' });
      expect(legsGame.targetScore).toBe(0);

      const mockRounds = new Collection([
        { score: 45, _gameId: 'testGame' },
        { score: 180, _gameId: 'testGame' },
        { score: 26, _gameId: 'testGame' },
      ]);
      Store._data['legs-rounds'] = mockRounds;

      expect(legsGame.targetScore).toBe(26);
    });
  });

  describe('get currentPlayer', () => {
    it('returns next active player in order of splash starting after last round and wrapping', () => {
      const player10 = { splash: 10, strikes: 0, _gameId: 'testGame' };
      const player30 = { splash: 30, strikes: 0, _gameId: 'testGame' };
      const player50 = { splash: 50, strikes: 0, _gameId: 'testGame' };
      const player20 = { splash: 20, strikes: 0, _gameId: 'testGame' };
      const player40 = { splash: 40, strikes: 0, _gameId: 'testGame' };
      const players = new Collection([player10, player30, player50, player20, player40]);
      Store._data['legs-players'] = players;

      const legsGame = new LegsGame({ id: 'testGame' });
      expect(legsGame.currentPlayer).toBe(player50);

      Store._data['legs-rounds'].filter = vi.fn().mockReturnValue({ last: { player: player40 } });
      expect(legsGame.currentPlayer).toBe(player30);

      Store._data['legs-rounds'].filter.mockReset();
      player50.strikes = 3;
      player20.strikes = 3;
      expect(legsGame.currentPlayer).toEqual(player40);
    });
  });
});
