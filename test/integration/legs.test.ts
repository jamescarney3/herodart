import { describe, it, expect } from 'vitest';

import LegsGame from '~/lib/legs/legs-game';
import type LegsPlayer from '~/lib/legs/legs-player';

// import LegsRound from '~/lib/legs-round';

describe('legs', () => {
  /* factories */
  const createBaseLegsGame = (): { game: LegsGame } => {
    const game = LegsGame.create();
    return { game };
  };

  const createThreePlayerGame = (): { game: LegsGame; moe: LegsPlayer; larry: LegsPlayer; curly: LegsPlayer } => {
    const game = LegsGame.create();
    const moe = game.createPlayer({ name: 'moe', splash: 20 });
    const larry = game.createPlayer({ name: 'larry', splash: 10 });
    const curly = game.createPlayer({ name: 'curly', splash: 30 });
    game.start();
    return { game, moe, larry, curly };
  };

  const createThreePlayerGameWithSixRoundsThrown = (): {
    game: LegsGame;
    moe: LegsPlayer;
    larry: LegsPlayer;
    curly: LegsPlayer;
  } => {
    const { game, moe, larry, curly } = createThreePlayerGame();
    game.scoreRound(curly, 45);
    game.scoreRound(moe, 60);
    game.scoreRound(larry, 26);
    game.scoreRound(curly, 45);
    game.scoreRound(moe, 41);
    game.scoreRound(larry, 26);
    return { game, moe, larry, curly };
  };

  describe('starting the game', () => {
    it('requires enough players to start', () => {
      const { game } = createBaseLegsGame();
      expect(game.canStart).toBe(false);
      expect(() => game.start()).toThrow();

      game.createPlayer({ name: 'moe', splash: 10 });
      expect(game.canStart).toBe(false);

      game.createPlayer({ name: 'larry', splash: 10 });
      expect(game.canStart).toBe(true);

      game.createPlayer({ name: 'curly', splash: 10 });
      game.createPlayer({ name: 'shemp', splash: 10 });
      game.createPlayer({ name: 'the other bad one', splash: 10 });
      expect(game.canStart).toBe(true);
    });
  });

  describe('determining turn order', () => {
    it('determines turn order at start of game', () => {
      const { game, moe, larry, curly } = createThreePlayerGame();
      expect(game.playerOrder).toEqual([curly, moe, larry]);
    });

    it('determines which player shoots next', () => {
      const { game, curly } = createThreePlayerGame();
      expect(game.currentPlayer).toBe(curly);
    });

    it('determines turn order after a round is thrown', () => {
      const { game, moe, larry, curly } = createThreePlayerGame();
      game.scoreRound(curly, 45);
      expect(game.playerOrder).toEqual([moe, larry, curly]);
    });
  });

  describe('determining target value', () => {
    it('starts with target value of zero', () => {
      const { game } = createThreePlayerGame();
      expect(game.targetScore).toBe(0);
    });

    it('calculates a new target value when a round is scored', () => {
      const { game, moe, larry, curly } = createThreePlayerGame();
      game.scoreRound(curly, 45);
      expect(game.targetScore).toBe(45);
      game.scoreRound(moe, 60);
      expect(game.targetScore).toBe(60);
      game.scoreRound(larry, 26);
      expect(game.targetScore).toBe(26);
    });
  });

  describe('counting strikes', () => {
    it('calculates strikes correctly for players', () => {
      const { moe, larry, curly } = createThreePlayerGameWithSixRoundsThrown();
      expect(curly.strikes).toBe(0);
      expect(moe.strikes).toBe(1);
      expect(larry.strikes).toBe(2);
    });

    it('determines whether a number would be a strike for the current player', () => {
      const { game, curly } = createThreePlayerGame();
      expect(game.scoreWouldBeStrike(0)).toBeFalsy();
      expect(game.scoreWouldBeStrike(45)).toBeFalsy();
      game.scoreRound(curly, 45);
      expect(game.scoreWouldBeStrike(26)).toBeTruthy();
      expect(game.scoreWouldBeStrike(45)).toBeFalsy();
      expect(game.scoreWouldBeStrike(60)).toBeFalsy();
    });
  });

  describe('eliminating players', () => {
    it('determines when a player is eliminated and reflects in order', () => {
      const { game, moe, larry, curly } = createThreePlayerGameWithSixRoundsThrown();
      expect(game.playerOrder).toEqual([curly, moe, larry]);
      game.scoreRound(curly, 45);
      expect(game.scoreWouldEliminateCurrentPlayer(36)).toBeFalsy();
      game.scoreRound(moe, 36);
      expect(game.scoreWouldEliminateCurrentPlayer(26)).toBeTruthy();
      game.scoreRound(larry, 26);
      expect(game.playerOrder).toEqual([curly, moe]);
    });
  });

  describe('ending the game', () => {
    it('determines when a game is finished', () => {
      const { game, moe, larry, curly } = createThreePlayerGameWithSixRoundsThrown();
      game.scoreRound(curly, 45);
      game.scoreRound(moe, 36);
      game.scoreRound(larry, 26);
      expect(game.finished).toBeFalsy();
      game.scoreRound(curly, 45);
      game.scoreRound(moe, 37);
      expect(game.finished).toBeTruthy();
    });

    it('determines which player won', () => {
      const { game, moe, larry, curly } = createThreePlayerGameWithSixRoundsThrown();
      expect(game.winner).toBe(null);
      game.scoreRound(curly, 45);
      game.scoreRound(moe, 36);
      game.scoreRound(larry, 26);
      game.scoreRound(curly, 45);
      game.scoreRound(moe, 37);
      expect(game.winner).toBe(curly);
    });
  });

  describe('calculating player stats', () => {
    it('calculates player averages', () => {
      const { moe, larry, curly } = createThreePlayerGameWithSixRoundsThrown();
      expect(curly.average).toBe(45);
      expect(larry.average).toBe(26);
      expect(moe.average).toBe(50.5);
    });
    it.todo('calculates player opponent averages');
  });
});
