import { Model, Collection, register, prop, hasMany } from '@jamescarney3/microrm';

import RouletteTurn from '~/lib/roulette/roulette-turn';
import RoulettePlayer from '~/lib/roulette/roulette-player';
import RouletteRound from '~/lib/roulette/roulette-round';

const TARGET_SCORE = 3;
const CHECKOUTS = [
  // one dart
  2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40,
  // two darts
  3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
  81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 56, 97, 98, 100, 101, 104, 107, 110,
  // three darts
  99, 102, 103, 105, 106, 108, 109, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127,
  128, 129, 130, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 160, 161,
  164, 167, 170,
];

const generateCheckout = (): number => {
  return CHECKOUTS[Math.floor(Math.random() * CHECKOUTS.length)];
};

@register('roulette-games')
class RouletteGame extends Model {
  @prop declare started: boolean;
  // @prop target: number = 5; // TODO: configurable-ize this
  @hasMany declare rouletteTurns: Collection<RouletteTurn>;
  @hasMany declare roulettePlayers: Collection<RoulettePlayer>;

  startGame(): void {
    if (this.roulettePlayers.length < 1) {
      throw new Error('roulette requires at least one player');
    }
    this.createTurn();
    this.started = true;
  }

  createPlayer(attributes: { name: string; ordinality: number }): RoulettePlayer {
    return RoulettePlayer.create({ rouletteGame: this, ...attributes });
  }

  createTurn(): RouletteTurn {
    const ordinality = this.rouletteTurns.length + 1;
    const checkout = generateCheckout();
    return RouletteTurn.create({ rouletteGame: this, ordinality, checkout });
  }

  scoreRound(player: RoulettePlayer, score: number): RouletteRound {
    const { currentTurn, gameTied } = this;
    const round = RouletteRound.create({
      rouletteGame: this,
      rouletteTurn: currentTurn,
      roulettePlayer: player,
      score,
    });

    if (currentTurn?.finished && (!this.targetReached || gameTied)) this.createTurn();
    return round;
  }

  get canStart(): boolean {
    return this.roulettePlayers.length >= 1 && !this.finished;
  }

  get playerOrder(): Collection<RoulettePlayer> {
    return this.roulettePlayers.sort(
      (playerA: RoulettePlayer, playerB: RoulettePlayer) => playerA.ordinality - playerB.ordinality,
    );
  }

  get currentTurnRemainingPlayers(): Collection<RoulettePlayer> {
    return this.roulettePlayers.filter(
      (player) => !player.rouletteRounds.some((round) => round.rouletteTurn === this.currentTurn),
    );
  }

  get turnOrder(): Collection<RouletteTurn> {
    return this.rouletteTurns.sort(
      (playerA: RouletteTurn, playerB: RouletteTurn) => playerA.ordinality - playerB.ordinality,
    );
  }

  get currentTurn(): RouletteTurn | void {
    return this.turnOrder.last;
  }

  get currentPlayer(): RoulettePlayer | void {
    // if (!this.currentTurn) return;

    const playersToShoot = this.playerOrder.filter((player) => {
      const playerRounds = player.rouletteRounds;
      return playerRounds.every((round) => round.rouletteTurn !== this.currentTurn);
    });

    return playersToShoot.first;
  }

  // TODO: find out why this can't be destructured??
  get targetReached() {
    return this.roulettePlayers.some((player) => player.totalScore >= TARGET_SCORE);
  }

  get gameTied() {
    // TODO: asbtract this
    const highScore = this.roulettePlayers
      .map((player) => player.totalScore)
      .sort((scoreA, scoreB) => scoreA - scoreB)
      .at(-1);
    return this.roulettePlayers.filter((player) => player.totalScore === highScore).length >= 2;
  }

  get finished(): boolean {
    // TODO: asbtract this too
    const lastTurnFinished = this.currentTurn?.finished;
    const highScore = this.roulettePlayers
      .map((player) => player.totalScore)
      .sort((scoreA, scoreB) => scoreA - scoreB)
      .at(-1);

    const remainingPlayersStatisticallyEliminated = this.currentTurnRemainingPlayers.every(
      (player) => player.totalScore + 1 < highScore!,
    );

    return this.targetReached && (lastTurnFinished || remainingPlayersStatisticallyEliminated);
  }

  get winner(): RoulettePlayer | void {
    if (!this.finished) return;
    return this.roulettePlayers.sort((playerA, playerB) => playerA.totalScore - playerB.totalScore).at(-1);
  }
}

export default RouletteGame;
