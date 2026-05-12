import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { Collection } from '@jamescarney3/microrm';

import ShanghaiGame from '~/lib/shanghai/shanghai-game';
import ShanghaiPlayer from '~/lib/shanghai/shanghai-player';
import ShanghaiRound from '~/lib/shanghai/shanghai-round';

vi.mock('~/lib/shanghai/shanghai-player', () => {
  class MockPlayer {
    static create = vi.fn().mockImplementation(() => ({}));
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
  const baseGame = ShanghaiGame.create({ id: 'test-id' });

  const rules = { endWedge: 20, generatePlayerOrderCalculator: () => () => 1 };
  const charlie = { name: 'charlie', splash: 10, eliminated: false };
  const mac = { name: 'mac', splash: 20, eliminated: false };
  const dennis = { name: 'dennis', splash: 30, eliminated: false };
  const players = new Collection([charlie, mac, dennis]);
  const rounds = new Collection([
    { wedge: 1, marks: 1, player: charlie },
    { wedge: 1, marks: 1, player: mac },
    { wedge: 1, marks: 1, player: dennis },
    { wedge: 2, marks: 1, player: charlie },
    { wedge: 2, marks: 1, player: mac },
    { wedge: 2, marks: 1, player: dennis },
    { wedge: 3, marks: 2, player: charlie },
    { wedge: 3, marks: 2, player: mac },
    { wedge: 3, marks: 2, player: dennis },
  ]);
  charlie.rounds = rounds.filter((r) => r.player === charlie);
  mac.rounds = rounds.filter((r) => r.player === mac);
  dennis.rounds = rounds.filter((r) => r.player === dennis);

  beforeEach(() => {
    vi.spyOn(baseGame, 'rules', 'get').mockReturnValue(rules);
    vi.spyOn(baseGame, 'players', 'get').mockReturnValue(players);
    vi.spyOn(baseGame, 'rounds', 'get').mockReturnValue(rounds);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('#createPlayer', () => {
    it('creates a a player instance', () => {
      const game = new ShanghaiGame();
      vi.spyOn(game, 'rules', 'get').mockReturnValue(rules);
      const player = game.createPlayer({});
      expect(ShanghaiPlayer.create).toHaveBeenCalledWith({ game: game });
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
      const rounds = new Collection([
        { player: 'charlie' },
        { player: 'dennis' },
        { player: 'frank' },
        { player: 'charlie' },
        { player: 'dennis' },
        { player: 'frank' },
        { player: 'charlie' },
        { player: 'dennis' },
        { player: 'frank' },
        { player: 'charlie' },
        { player: 'dennis' },
        { player: 'charlie' },
        { player: 'dennis' },
        { player: 'charlie' },
        { player: 'dennis' },
        { player: 'charlie' },
        { player: 'dennis' },
      ]);
      vi.spyOn(baseGame, 'rounds', 'get').mockReturnValue(rounds);

      expect(baseGame.getWedgeByRound(rounds.at(0))).toBe(1);
      expect(baseGame.getWedgeByRound(rounds.at(-1))).toBe(7);
    });
  });

  describe('#scoreRound', () => {
    it('scores a round of shanghai', () => {
      const player = new ShanghaiPlayer();
      const darts = [3, 1, 1];
      baseGame.scoreRound(player, darts);
      expect(ShanghaiRound.create).toHaveBeenCalledWith({ game: baseGame, player, darts });
    });
  });

  describe('#playerExistsWithName', () => {
    it('returns true when player exists with given name and false when one does not', () => {
      vi.spyOn(baseGame, 'players', 'get').mockReturnValue([{ name: 'James' }, { name: 'Matt' }]);

      expect(baseGame.playerExistsWithName('James')).toBe(true);
      expect(baseGame.playerExistsWithName('Maloof')).toBe(false);
    });
  });

  describe('get finished', () => {
    it('returns false when game has not started', () => {
      vi.spyOn(baseGame, 'started', 'get').mockReturnValue(false);
      expect(baseGame.finished).toBe(false);
    });

    it('returns true when all rounds are thrown', () => {
      vi.spyOn(baseGame, 'started', 'get').mockReturnValue(true);
      vi.spyOn(baseGame, 'shanghaiScored', 'get').mockReturnValue(false);
      vi.spyOn(baseGame, 'rules', 'get').mockReturnValue({ endWedge: 20 });
      expect(baseGame.finished).toBe(false);

      vi.spyOn(baseGame, 'rules', 'get').mockReturnValue({ endWedge: 3 });
      expect(baseGame.finished).toBe(true);
    });

    it('returns true when a shanghai round has been thrown', () => {
      vi.spyOn(baseGame, 'started', 'get').mockReturnValue(true);
      vi.spyOn(baseGame, 'shanghaiScored', 'get').mockReturnValue(true);
      expect(baseGame.finished).toBe(true);
    });
  });

  describe('get bestTotalScore', () => {
    it('returns best total score for a player', () => {
      const players = new Collection([
        { totalScore: 1 },
        { totalScore: 10 },
        { totalScore: 20 },
        { totalScore: 2 },
        { totalScore: 4 },
        { totalScore: 8 },
      ]);
      vi.spyOn(baseGame, 'players', 'get').mockReturnValue(players);

      expect(baseGame.bestTotalScore).toBe(20);
    });
  });

  describe('get shanghaiScored', () => {
    it('returns true when shanghai has been scored', () => {
      const game = new ShanghaiGame();
      const rounds = [{ isShanghai: true }];
      vi.spyOn(game, 'rounds', 'get').mockReturnValue(rounds);
      expect(game.shanghaiScored).toBe(true);
    });

    it('returns true false shanghai has not been scored', () => {
      const game = new ShanghaiGame();
      const rounds = [{ isShanghai: false }];
      vi.spyOn(game, 'rounds', 'get').mockReturnValue(rounds);
      expect(game.shanghaiScored).toBe(false);
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
  });

  describe('get winners', () => {
    let arthur;
    let ford;
    let trillian;
    let zaphod;
    let marvin;
    let players;

    beforeEach(() => {
      arthur = { totalScore: 30, rounds: [] };
      ford = { totalScore: 30, rounds: [] };
      trillian = { totalScore: 30, rounds: [] };
      zaphod = { totalScore: 25, rounds: [] };
      marvin = { totalScore: 20, rounds: [] };
      players = new Collection([arthur, ford, trillian, zaphod, marvin]);

      vi.spyOn(baseGame, 'players', 'get').mockReturnValue(players);
      vi.spyOn(baseGame, 'finished', 'get').mockReturnValue(true);
      vi.spyOn(baseGame, 'shanghaiScored', 'get').mockReturnValue(false);
      vi.spyOn(baseGame, 'bestTotalScore', 'get').mockReturnValue(30);
    });

    it('returns empty array when game is unfinished', () => {
      vi.spyOn(baseGame, 'finished', 'get').mockReturnValue(false);
      expect(baseGame.winners).toEqual([]);
    });

    it('returns player who scored shanghai when shanghai was scored', () => {
      const rounds = new Collection([{ isShanghai: true, player: zaphod }]);
      vi.spyOn(baseGame, 'shanghaiScored', 'get').mockReturnValue(true);
      vi.spyOn(baseGame, 'rounds', 'get').mockReturnValue(rounds);
      expect(baseGame.winners).toEqual([zaphod]);
    });

    it('returns players with best total scores when no shanghai is scored', () => {
      expect(baseGame.winners).toEqual([arthur, ford, trillian]);
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

  describe('get staticPlayerOrder', () => {
    const player10 = { splash: 10 };
    const player30 = { splash: 30 };
    const player50 = { splash: 50 };
    const player40 = { splash: 40 };
    const player20 = { splash: 20 };

    it('returns players ordered by splash disregarding turn', () => {
      const game = new ShanghaiGame();
      vi.spyOn(game, 'players', 'get').mockReturnValue([player10, player30, player50, player40, player20]);
      expect(game.staticPlayerOrder).toEqual([player50, player40, player30, player20, player10]);
    });
  });

  describe('get currentPlayer', () => {
    it('returns next player to shoot', () => {
      const game = new ShanghaiGame();
      const [moe, larry, curly, shemp] = [
        { name: 'moe', eliminated: false },
        { name: 'larry', eliminated: true },
        { name: 'curly', eliminated: true },
        { name: 'shemp', eliminated: false },
      ];
      vi.spyOn(game, 'staticPlayerOrder', 'get').mockReturnValue(new Collection([moe, larry, curly, shemp]));
      vi.spyOn(game, 'rounds', 'get').mockReturnValue(new Collection([{ player: larry }]));

      expect(game.currentPlayer).toBe(shemp);
    });
  });

  describe('get currentWedge', () => {
    it("returns the target wedge for the current player's shot", () => {
      const game = new ShanghaiGame();

      vi.spyOn(game, 'currentPlayer', 'get').mockReturnValue({ rounds: new Array(10) });

      expect(game.currentWedge).toBe(11);
    });
  });
});
