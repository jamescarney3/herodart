import { describe, expect, it, afterEach, vi } from 'vitest';

import ShanghaiGame from '~/lib/shanghai/shanghai-game';
import ShanghaiPlayer from '~/lib/shanghai/shanghai-player';
import ShanghaiRound from '~/lib/shanghai/shanghai-round';
import Collection from '~/lib/v2/collection';

vi.mock('~/lib/shanghai/shanghai-player', () => {
  class MockPlayer {
    static create = vi.fn().mockImplementation(() => 'extant player');
  }

  return { default: MockPlayer };
});

vi.mock('~/lib/shanghai/shanghai-round', () => {
  class MockRound {
    static create = vi.fn().mockImplementation(() => 'extant round');
  }

  return { default: MockRound };
});

describe('ShanghaiGame class', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('instantiates with props', () => {
    const shanghaiGame = ShanghaiGame.create({ id: 'test-id' });

    expect(shanghaiGame.id).toBe('test-id');
  });

  describe('#createPlayer', () => {
    it('creates a a player instance', () => {
      const game = new ShanghaiGame();
      const player = game.createPlayer({});

      expect(ShanghaiPlayer.create).toHaveBeenCalledWith({ game });
      expect(player).toBeTruthy();
    });
  });

  describe('#start', () => {
    it('starts game', () => {
      const game = new ShanghaiGame();
      game.start();
      expect(game.started).toBeTruthy();
    });
  });

  describe('#getWedgeByRound', () => {
    it('calculates the wedge for a given round', () => {
      const game = new ShanghaiGame();
      const firstRound = vi.fn();
      const thirdRound = vi.fn();
      const seventhRound = vi.fn();

      vi.spyOn(game, 'players', 'get').mockReturnValue(['first', 'second', 'third']);
      vi.spyOn(game, 'rounds', 'get').mockReturnValue([
        // 1
        firstRound, {}, thirdRound,
        // 2
        {}, {}, {},
        // 3
        seventhRound, {}, {},
      ]);

      expect(game.getWedgeByRound(firstRound)).toBe(1);
      expect(game.getWedgeByRound(thirdRound)).toBe(1);
      expect(game.getWedgeByRound(seventhRound)).toBe(3);
    });
  });

  describe('#scoreRound', () => {
    it('scores a round of shanghai', () => {
      const game = new ShanghaiGame();
      const player = new ShanghaiPlayer();
      const darts = [3, 1, 1];

      game.scoreRound(player, darts);
      expect(ShanghaiRound.create).toHaveBeenCalledWith({ game, player, darts });
    });
  });

  describe('#playerExistsWithName', () => {
    it('returns true when player exists with given name and false when one does not', () => {
      const game = new ShanghaiGame();

      vi.spyOn(game, 'players', 'get').mockReturnValue([{ name: 'James' }, { name: 'Matt' }]);

      expect(game.playerExistsWithName('James')).toBe(true);
      expect(game.playerExistsWithName('Maloof')).toBe(false);
    });
  });

  describe('get finished', () => {
    it('returns true when all rounds are thrown', () => {
      const game = new ShanghaiGame();
      vi.spyOn(game, 'rounds', 'get').mockReturnValue(new Array(60).fill({}));
      vi.spyOn(game, 'players', 'get').mockReturnValue(new Array(3).fill({}));

      expect(game.finished).toBe(true);
    });

    it('returns true when a shanghai round has been thrown', () => {
      const game = new ShanghaiGame();
      const rounds = new Array(59).fill({});

      vi.spyOn(game, 'rounds', 'get').mockReturnValue(rounds);
      vi.spyOn(game, 'players', 'get').mockReturnValue(new Array(3).fill({}));

      expect(game.finished).toBe(false);

      rounds[37] = { isShanghai: true };
      expect(game.finished).toBe(true);
    });
  });

  describe('get canStart', () => {
    const game = new ShanghaiGame();
    const players = ['mac'];
    vi.spyOn(game, 'players', 'get').mockReturnValue(players);

    it('is false when game has fewer than 2 players', () => {
      expect(game.canStart).toBe(false);
    });

    it('is true when game has 2 players', () => {
      players.push('charlie');
      expect(game.canStart).toBe(true);
      players.push('dennis');
      expect(game.canStart).toBe(true);
    });

    it('is false when game is already started', () => {
      game.started = true;
      expect(game.canStart).toBe(false);
    });
  });

  describe('get tie', () => {
    const game = new ShanghaiGame();
    const players = new Collection();
    const rounds = new Collection();

    vi.spyOn(game, 'players', 'get').mockReturnValue(players);
    vi.spyOn(game, 'rounds', 'get').mockReturnValue(rounds);

    it('returns true when two or more players are tied with best marks', () => {
      vi.spyOn(game, 'players', 'get').mockReturnValue(new Collection([
        { marks: 30 },
        { marks: 30 },
        { marks: 20 },
      ]));

      expect(game.tie).toBe(true);
    });

    it('returns false when shanghai scoring round is present', () => {
      vi.spyOn(game, 'rounds', 'get').mockReturnValue(new Collection([{ isShanghai: true }]));
      expect(game.tie).toBe(false);
    });
  });

  describe('get winner', () => {
    const game = new ShanghaiGame();
    vi.spyOn(game, 'players', 'get').mockReturnValue([]);
    vi.spyOn(game, 'rounds', 'get').mockReturnValue([]);

    it('returns null when game is not finished', () => {
      expect(game.winner).toBe(null);
    });

    it('returns a player with a shanghai round', () => {
      const frank = 'frank reynolds';
      const shanghai = { isShanghai: true, player: frank };
      vi.spyOn(game, 'rounds', 'get').mockReturnValue([shanghai]);

      expect(game.winner).toBe(frank);
    });

    it('returns the player with the highest total marks if no shanghai', () => {
      const dee = { marks: 30 };
      const cricket = { marks: 40 };
      const liam = { marks: 25 };
      const ryan = { marks: 15 };
      const players = [dee, cricket, liam, ryan];

      vi.spyOn(game, 'finished', 'get').mockReturnValue(true);
      vi.spyOn(game, 'rounds', 'get').mockReturnValue([]);
      vi.spyOn(game, 'players', 'get').mockImplementation(() => {
        const originalSort = players.sort.bind(players);
        players.sort = ((predicate) => {
          const result = originalSort(predicate);
          result.first = result.at(0);
          return result;
        });
        return players;
      });
      expect(game.winner).toBe(cricket);
    });
  });

  describe('get tieWinners', () => {
    const game = new ShanghaiGame();

    const arthur = { marks: 30 };
    const ford = { marks: 30 };
    const trillian = { marks: 30 };
    const zaphod = { marks: 25 };
    const marvin = { marks: 20 };
    const players = new Collection([arthur, ford, trillian, zaphod, marvin]);

    vi.spyOn(game, 'players', 'get').mockReturnValue(players);

    it('returns multiple winners tied for best score', () => {
      expect(game.tieWinners).toContain(arthur, ford, trillian);
    });
  });

  describe('get playerOrder', () => {
    const player10 = { splash: 10 };
    const player30 = { splash: 30 };
    const player50 = { splash: 50 };
    const player40 = { splash: 40 };
    const player20 = { splash: 20 };

    it('returns players ordered by splash', () => {
      const game = new ShanghaiGame();
      vi.spyOn(game, 'players', 'get').mockReturnValue([player10, player30, player50, player40, player20]);
      vi.spyOn(game, 'rounds', 'get').mockReturnValue([]);

      expect(game.playerOrder).toEqual([player50, player40, player30, player20, player10]);

      vi.spyOn(game, 'rounds', 'get').mockReturnValue({ last: { player: player40 } });
      expect(game.playerOrder).toEqual([player30, player20, player10, player50, player40]);

      vi.spyOn(game, 'rounds', 'get').mockReturnValue({ last: { player: player10 } });
      expect(game.playerOrder).toEqual([player50, player40, player30, player20, player10]);
    });
  });

  describe('get currentPlayer', () => {
    it('returns next player to shoot', () => {
      const game = new ShanghaiGame();
      const firstPlayer = {};
      vi.spyOn(game, 'playerOrder', 'get').mockReturnValue({ first: firstPlayer });

      expect(game.currentPlayer).toBe(firstPlayer);
    });
  });

  describe('get currentWedge', () => {
    it('returns the target wedge for the current player\'s shot', () => {
      const game = new ShanghaiGame();

      vi.spyOn(game, 'rounds', 'get').mockReturnValue(new Array(31).fill({}));
      vi.spyOn(game, 'players', 'get').mockReturnValue(new Array(3).fill({}));

      expect(game.currentWedge).toBe(11);
    });
  });
});
