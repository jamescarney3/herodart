import { describe, it, expect } from 'vitest';
import { Collection } from '@jamescarney3/microrm';

import ShanghaiGame from '~/lib/shanghai/shanghai-game';
import ShanghaiRules, { ELIMINATION, END_WEDGE, SCORING } from '~/lib/shanghai/shanghai-rules';
import ShanghaiPlayer from '~/lib/shanghai/shanghai-player';

const deepSumMarksRounds = (rounds: number[][]): number => {
  return rounds.reduce((outer: number, round: number[]) => {
    return outer + round.reduce((inner: number, dart: number) => inner + dart, 0);
  }, 0);
};

const deepSumWedgeRounds = (rounds: number[][]): number => {
  return rounds.reduce((outer: number, round: number[], idx) => {
    return outer + round.reduce((inner: number, dart: number) => inner + dart, 0) * (idx + 1);
  }, 0);
};

describe('shanghai', () => {
  const createBaseShanghaiGame = (): { game: ShanghaiGame } => {
    const game = ShanghaiGame.create();
    return { game };
  };

  const createThreePlayerGame = (): {
    game: ShanghaiGame;
    mac: ShanghaiPlayer;
    charlie: ShanghaiPlayer;
    dee: ShanghaiPlayer;
  } => {
    const { game } = createBaseShanghaiGame();
    const rules = ShanghaiRules.create();
    game.shanghaiRules = rules;
    const mac = game.createPlayer({ name: 'mac', splash: 1 });
    const charlie = game.createPlayer({ name: 'charlie', splash: 2 });
    const dee = game.createPlayer({ name: 'dee', splash: 3 });
    game.start();
    return { game, mac, charlie, dee };
  };

  const createGameToSevenWedge = (): {
    game: ShanghaiGame;
    mac: ShanghaiPlayer;
    charlie: ShanghaiPlayer;
    dee: ShanghaiPlayer;
  } => {
    const { game, mac, charlie, dee } = createThreePlayerGame();
    game.shanghaiRules.endWedge = END_WEDGE.SEVEN;
    return { game, mac, charlie, dee };
  };

  describe('starting the game', () => {
    it('requires rules and enough players to start', () => {
      const rules = ShanghaiRules.create();
      const mac = ShanghaiPlayer.create({ name: 'mac' });
      const charlie = ShanghaiPlayer.create({ name: 'charlie' });
      const dee = ShanghaiPlayer.create({ name: 'dee' });

      const { game } = createBaseShanghaiGame();
      expect(game.canStart).toBe(false);

      const { game: gameWithRules } = createBaseShanghaiGame();
      gameWithRules.rules = rules;
      expect(gameWithRules.canStart).toBe(false);

      const { game: gameWithPlayers } = createBaseShanghaiGame();
      gameWithPlayers.shanghaiPlayers = Collection.create([mac]);
      expect(gameWithPlayers.canStart).toBe(false);
      gameWithPlayers.shanghaiPlayers = Collection.create([mac, charlie]);
      expect(gameWithPlayers.canStart).toBe(false);
      gameWithPlayers.shanghaiPlayers = Collection.create([mac, charlie, dee]);
      expect(gameWithPlayers.canStart).toBe(false);

      const { game: gameWithPlayersAndRules } = createBaseShanghaiGame();
      gameWithPlayersAndRules.shanghaiRules = rules;
      expect(gameWithPlayersAndRules.canStart).toBe(false);
      gameWithPlayersAndRules.shanghaiPlayers = Collection.create([mac]);
      expect(gameWithPlayersAndRules.canStart).toBe(false);
      gameWithPlayersAndRules.shanghaiPlayers = Collection.create([mac, charlie]);
      expect(gameWithPlayersAndRules.canStart).toBe(true);
      gameWithPlayersAndRules.shanghaiPlayers = Collection.create([mac, charlie, dee]);
      expect(gameWithPlayersAndRules.canStart).toBe(true);
    });

    it('starts', () => {
      const { game } = createBaseShanghaiGame();
      expect(game.started).toBeFalsy();
      game.start();
      expect(game.started).toBe(true);
    });
  });

  describe('creating players', () => {
    it('creates an associated player instance', () => {
      const { game } = createBaseShanghaiGame();
      game.shanghaiRules = ShanghaiRules.create();
      const zaphod = game.createPlayer({ name: 'zaphod' });
      expect(game.shanghaiPlayers).toContain(zaphod);
    });
  });

  describe('determining turn order', () => {
    it('determines turn order at start of game', () => {
      const { game, mac, charlie, dee } = createThreePlayerGame();
      expect(game.playerOrder).toEqual([dee, charlie, mac]);
    });

    it('determines turn order after each shot', () => {
      const { game, mac, charlie, dee } = createThreePlayerGame();
      expect(game.playerOrder).toEqual([dee, charlie, mac]);
      game.scoreRound(dee, [1, 1, 1]);
      expect(game.playerOrder).toEqual([charlie, mac, dee]);
      game.scoreRound(charlie, [1, 1, 1]);
      expect(game.playerOrder).toEqual([mac, dee, charlie]);
      game.scoreRound(mac, [1, 1, 1]);
      expect(game.playerOrder).toEqual([dee, charlie, mac]);
    });

    it('determines current shooter', () => {
      const { game, dee } = createThreePlayerGame();
      expect(game.currentPlayer).toBe(dee);
    });

    it('determines current shooter after rounds are shot', () => {
      const { game, mac, charlie, dee } = createThreePlayerGame();
      expect(game.currentPlayer).toBe(dee);
      game.scoreRound(dee, [1, 1, 1]);
      expect(game.currentPlayer).toBe(charlie);
      game.scoreRound(charlie, [1, 1, 1]);
      expect(game.currentPlayer).toBe(mac);
      game.scoreRound(mac, [1, 1, 1]);
      expect(game.currentPlayer).toBe(dee);
    });
  });

  describe('determining target wedge for current shooter', () => {
    it('calculates the current wedge', () => {
      const { game, mac, charlie, dee } = createThreePlayerGame();
      expect(game.currentWedge).toBe(1);
      game.scoreRound(dee, [1, 1, 1]);
      expect(game.currentWedge).toBe(1);
      game.scoreRound(charlie, [1, 1, 1]);
      expect(game.currentWedge).toBe(1);
      game.scoreRound(mac, [1, 1, 1]);
      expect(game.currentWedge).toBe(2);
    });
  });

  describe('eliminating players', () => {
    it('does not eliminate players in non-elimination games', () => {
      const { game, mac, charlie, dee } = createThreePlayerGame();
      game.shanghaiRules.elimination = ELIMINATION.NONE;
      game.scoreRound(dee, [1, 1, 1]);
      game.scoreRound(charlie, [0, 0, 0]);
      game.scoreRound(mac, [1, 1, 1]);
      expect(dee.eliminated).toBe(false);
      expect(charlie.eliminated).toBe(false);
      expect(mac.eliminated).toBe(false);
    });

    it('correctly eliminates players in single elimination games', () => {
      const { game, mac, charlie, dee } = createThreePlayerGame();
      game.shanghaiRules.elimination = ELIMINATION.SINGLE;
      game.scoreRound(dee, [1, 1, 1]);
      game.scoreRound(charlie, [0, 0, 0]);
      game.scoreRound(mac, [1, 1, 1]);
      expect(dee.eliminated).toBe(false);
      expect(charlie.eliminated).toBe(true);
      expect(mac.eliminated).toBe(false);
    });

    it('correctly eliminates players in double elimination games', () => {
      const { game, mac, charlie, dee } = createThreePlayerGame();
      game.shanghaiRules.elimination = ELIMINATION.DOUBLE;
      game.scoreRound(dee, [1, 1, 1]);
      game.scoreRound(charlie, [0, 0, 0]);
      game.scoreRound(mac, [1, 1, 1]);
      game.scoreRound(dee, [1, 1, 1]);
      game.scoreRound(charlie, [0, 0, 0]);
      game.scoreRound(mac, [0, 0, 0]);
      expect(dee.eliminated).toBe(false);
      expect(charlie.eliminated).toBe(true);
      expect(mac.eliminated).toBe(false);
    });
  });

  describe('ending the game', () => {
    it('determines when a game is finished with all rounds thrown', () => {
      const { game, mac, charlie, dee } = createGameToSevenWedge();
      for (let i = 0; i < game.shanghaiPlayers.length * 6; i++) {
        if (i % 3 === 0) game.scoreRound(dee, [1, 0, 0]);
        if (i % 3 === 1) game.scoreRound(charlie, [1, 0, 0]);
        if (i % 3 === 2) game.scoreRound(mac, [1, 0, 0]);
      }
      game.scoreRound(dee, [1, 0, 0]);
      expect(game.finished).toBe(false);
      game.scoreRound(charlie, [1, 0, 0]);
      expect(game.finished).toBe(false);
      game.scoreRound(mac, [1, 0, 0]);
      expect(game.finished).toBe(true);
    });

    it('determines when a game is finished with a shanghai round', () => {
      const { game, dee } = createThreePlayerGame();
      game.scoreRound(dee, [1, 2, 3]);
      expect(game.finished).toBe(true);
    });

    it('determines when a game is finished by elimination', () => {
      const { game, mac, charlie, dee } = createThreePlayerGame();
      game.shanghaiRules.elimination = ELIMINATION.SINGLE;
      game.scoreRound(dee, [0, 0, 0]);
      game.scoreRound(charlie, [0, 0, 0]);
      game.scoreRound(mac, [1, 0, 0]);
      expect(game.finished).toBe(true);

      game.shanghaiRules.elimination = ELIMINATION.DOUBLE;
      expect(game.finished).toBe(false);

      game.scoreRound(dee, [0, 0, 0]);
      game.scoreRound(charlie, [0, 0, 0]);
      expect(game.finished).toBe(true);
    });
  });

  describe('winning the game', () => {
    it('does not return winners when game is not finished', () => {
      const { game } = createThreePlayerGame();
      expect(game.winners).toEqual([]);
    });

    it('correctly identifies winner in a game won by shanghai', () => {
      const { game, dee } = createThreePlayerGame();
      game.scoreRound(dee, [1, 2, 3]);
      expect(game.winners).toContain(dee);
    });

    it('correctly identifies winner in a game won by elimination', () => {
      const { game, mac, charlie, dee } = createThreePlayerGame();
      game.shanghaiRules.elimination = ELIMINATION.SINGLE;
      game.scoreRound(dee, [1, 3, 0]);
      game.scoreRound(charlie, [1, 3, 0]);
      game.scoreRound(mac, [1, 0, 0]);
      game.scoreRound(dee, [0, 0, 0]);
      game.scoreRound(charlie, [0, 0, 0]);
      game.scoreRound(mac, [1, 0, 0]);
      expect(game.winners).toEqual([mac]);
    });

    it('correctly identifies winner by marks vs wedge value', () => {
      const { game, mac, charlie, dee } = createGameToSevenWedge();
      game.shanghaiRules.scoring = SCORING.MARKS;
      // first round
      game.scoreRound(dee, [3, 3, 3]); // 9 marks, 9 points on 1 wedge
      game.scoreRound(charlie, [0, 0, 0]);
      game.scoreRound(mac, [0, 0, 0]);
      // intervening 5 turns before last round
      for (let i = 0; i < game.shanghaiPlayers.length * 5; i++) {
        if (i % 3 === 0) game.scoreRound(dee, [1, 0, 0]);
        if (i % 3 === 1) game.scoreRound(charlie, [1, 0, 0]);
        if (i % 3 === 2) game.scoreRound(mac, [1, 0, 0]);
      }
      // last round
      game.scoreRound(dee, [0, 0, 0]);
      game.scoreRound(charlie, [0, 0, 0]);
      game.scoreRound(mac, [1, 1, 0]); // 2 marks, 14 points on 7 wedge

      expect(game.winners).toEqual([dee]);
      game.shanghaiRules.scoring = SCORING.WEDGE;
      expect(game.winners).toEqual([mac]);
    });

    it('correctly identifies multiple winners', () => {
      const { game, mac, charlie, dee } = createGameToSevenWedge();
      for (let i = 0; i < game.shanghaiPlayers.length * 7; i++) {
        if (i % 3 === 0) game.scoreRound(dee, [1, 1, 0]);
        if (i % 3 === 1) game.scoreRound(charlie, [1, 1, 0]);
        if (i % 3 === 2) game.scoreRound(mac, [1, 0, 0]);
      }
      expect(game.winners).toContain(charlie);
      expect(game.winners).toContain(dee);
    });
  });

  describe('calculating player stats', () => {
    it('accurately calculates player mpr', () => {
      const { game, mac, charlie, dee } = createGameToSevenWedge();
      const deeRounds: [number, number, number][] = [
        [1, 2, 3],
        [1, 2, 1],
        [0, 0, 1],
        [1, 0, 0],
        [3, 0, 3],
        [1, 0, 0],
        [0, 1, 0],
      ];
      const charlieRounds: [number, number, number][] = [
        [1, 0, 3],
        [0, 1, 0],
        [0, 0, 1],
        [2, 0, 1],
        [0, 3, 0],
        [1, 3, 1],
        [1, 1, 0],
      ];
      const macRounds: [number, number, number][] = [
        [1, 1, 0],
        [1, 0, 1],
        [0, 0, 2],
        [0, 1, 0],
        [0, 1, 1],
        [0, 3, 1],
        [0, 2, 1],
      ];

      for (let i = 0; i < 7; i++) {
        game.scoreRound(dee, deeRounds[i]);
        game.scoreRound(charlie, charlieRounds[i]);
        game.scoreRound(mac, macRounds[i]);
      }

      expect(dee.mpr).toBe(deepSumMarksRounds(deeRounds) / 7);
      expect(charlie.mpr).toBe(deepSumMarksRounds(charlieRounds) / 7);
      expect(mac.mpr).toBe(deepSumMarksRounds(macRounds) / 7);
    });

    it('accurately calculates player total score', () => {
      const { game, mac, charlie, dee } = createGameToSevenWedge();
      const deeRounds: [number, number, number][] = [
        [1, 2, 3],
        [1, 2, 1],
        [0, 0, 1],
        [1, 0, 0],
        [3, 0, 3],
        [1, 0, 0],
        [0, 1, 0],
      ];
      const charlieRounds: [number, number, number][] = [
        [1, 0, 3],
        [0, 1, 0],
        [0, 0, 1],
        [2, 0, 1],
        [0, 3, 0],
        [1, 3, 1],
        [1, 1, 0],
      ];
      const macRounds: [number, number, number][] = [
        [1, 1, 0],
        [1, 0, 1],
        [0, 0, 2],
        [0, 1, 0],
        [0, 1, 1],
        [0, 3, 1],
        [0, 2, 1],
      ];

      for (let i = 0; i < 7; i++) {
        game.scoreRound(dee, deeRounds[i]);
        game.scoreRound(charlie, charlieRounds[i]);
        game.scoreRound(mac, macRounds[i]);
      }

      game.shanghaiRules.scoring = SCORING.MARKS;
      expect(dee.totalScore).toBe(deepSumMarksRounds(deeRounds));
      expect(charlie.totalScore).toBe(deepSumMarksRounds(charlieRounds));
      expect(mac.totalScore).toBe(deepSumMarksRounds(macRounds));

      game.shanghaiRules.scoring = SCORING.WEDGE;
      expect(dee.totalScore).toBe(deepSumWedgeRounds(deeRounds));
      expect(charlie.totalScore).toBe(deepSumWedgeRounds(charlieRounds));
      expect(mac.totalScore).toBe(deepSumWedgeRounds(macRounds));
    });
  });
});
