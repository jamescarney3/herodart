import { describe, it, expect } from 'vitest';

import RouletteGame from '~/lib/roulette/roulette-game';
import type RoulettePlayer from '~/lib/roulette/roulette-player';

describe('roulette', () => {
  const createBaseRouletteGame = (): { game: RouletteGame } => {
    return { game: RouletteGame.create() };
  };

  const createOnePlayerGame = (): {
    game: RouletteGame;
    dewey: RoulettePlayer;
  } => {
    const { game } = createBaseRouletteGame();
    const dewey = game.createPlayer({ name: 'dewey', ordinality: 1 });
    game.startGame();
    return { game, dewey };
  };

  const createThreePlayerGame = (): {
    game: RouletteGame;
    malcolm: RoulettePlayer;
    reese: RoulettePlayer;
    francis: RoulettePlayer;
  } => {
    const { game } = createBaseRouletteGame();
    const malcolm = game.createPlayer({ name: 'malcolm', ordinality: 1 });
    const reese = game.createPlayer({ name: 'reese', ordinality: 2 });
    const francis = game.createPlayer({ name: 'francis', ordinality: 3 });
    game.startGame();
    return { game, malcolm, reese, francis };
  };

  describe('starting the game', () => {
    it('requires at least one player to start', () => {
      const { game } = createBaseRouletteGame();
      expect(game.canStart).toBe(false);
      expect(() => game.startGame()).toThrow();

      game.createPlayer({ name: 'moe', ordinality: 10 });
      expect(game.canStart).toBe(true);
    });

    it('starts the game', () => {
      const { game } = createBaseRouletteGame();
      game.createPlayer({ name: 'moe', ordinality: 10 });
      game.startGame();
      expect(game.started).toBe(true);
    });
  });

  describe('determining player order', () => {
    it('determines player order at start of game', () => {
      const { game, malcolm, reese, francis } = createThreePlayerGame();
      expect(game.playerOrder).toEqual([malcolm, reese, francis]);
    });

    it('determines which player shoots next', () => {
      const { game, malcolm, reese, francis } = createThreePlayerGame();
      expect(game.currentPlayer).toBe(malcolm);
      game.scoreRound(malcolm, 0);
      expect(game.currentPlayer).toBe(reese);
      game.scoreRound(reese, 0);
      expect(game.currentPlayer).toBe(francis);
      game.scoreRound(francis, 0);
      expect(game.currentPlayer).toBe(malcolm);
    });
  });

  describe('scoring rounds', () => {
    it('scores a round correctly', () => {
      const { game, dewey } = createOnePlayerGame();
      const round = game.scoreRound(dewey, 48);
      expect(round.roulettePlayer).toBe(dewey);
      expect(round.score).toBe(48);
    });

    it('creates a new turn when score finished current turn', () => {
      const { game, malcolm, reese, francis } = createThreePlayerGame();
      const firstTurn = game.currentTurn;
      game.scoreRound(malcolm, 0);
      game.scoreRound(reese, 0);
      game.scoreRound(francis, 0);
      expect(game.currentTurn).not.toBe(firstTurn);
    });
  });

  describe('calculating player scores', () => {
    it('accurately calculates total score for a player', () => {
      const { game, dewey } = createOnePlayerGame();
      expect(dewey.totalScore).toBe(0);
      game.scoreRound(dewey, game.currentTurn!.checkout);
      expect(dewey.totalScore).toBe(1);
      game.scoreRound(dewey, game.currentTurn!.checkout);
      expect(dewey.totalScore).toBe(2);
      game.scoreRound(dewey, 0);
      expect(dewey.totalScore).toBe(2);
    });
  });

  describe('finishing the game', () => {
    it('ends when one player reaches checkout target', () => {
      const { game, dewey } = createOnePlayerGame();
      expect(game.finished).toBe(false);
      game.scoreRound(dewey, game.currentTurn!.checkout);
      expect(game.finished).toBe(false);
      game.scoreRound(dewey, game.currentTurn!.checkout);
      expect(game.finished).toBe(false);
      game.scoreRound(dewey, game.currentTurn!.checkout);
      expect(game.finished).toBe(true);
    });

    it('does not end when multiple players reach checkout target', () => {
      const { game, malcolm, reese, francis } = createThreePlayerGame();
      for (let i = 1; i <= 3; i++) {
        game.scoreRound(malcolm, game.currentTurn!.checkout);
        game.scoreRound(reese, game.currentTurn!.checkout);
        game.scoreRound(francis, 0);
      }
      expect(game.finished).toBe(false);
    });

    it('ends when one of multiple players over chceckout target takes lead', () => {
      const { game, malcolm, reese, francis } = createThreePlayerGame();
      for (let i = 1; i <= 3; i++) {
        game.scoreRound(malcolm, game.currentTurn!.checkout);
        game.scoreRound(reese, game.currentTurn!.checkout);
        game.scoreRound(francis, 0);
      }
      expect(game.finished).toBe(false);
      game.scoreRound(malcolm, 0);
      game.scoreRound(reese, game.currentTurn!.checkout);
      expect(game.finished).toBe(true);
    });

    it('determines winner in multiplayer game', () => {
      const { game, malcolm, reese, francis } = createThreePlayerGame();
      for (let i = 1; i <= 2; i++) {
        game.scoreRound(malcolm, game.currentTurn!.checkout);
        game.scoreRound(reese, 0);
        game.scoreRound(francis, 0);
      }
      expect(game.winner).not.toBeDefined();
      game.scoreRound(malcolm, game.currentTurn!.checkout);
      expect(game.winner).toBe(malcolm);
    });
  });
});
