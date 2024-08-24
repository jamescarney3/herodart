import Model, { prop, key, hasMany, observed } from '~/lib/model';
import { collection } from '~/lib/store';
import Player from '~/lib/legs/legs-player';
import Round from '~/lib/legs/legs-round';

@collection
export default class LegsGame extends Model {
  static _storeKey = 'legs-games';

  @key declare id: string;
  @prop declare started: boolean = false;

  @hasMany('legs-players', { foreignKey: 'gameId' }) declare players: Player[];
  @hasMany('legs-rounds', { foreignKey: 'gameId' }) declare rounds: Round[];

  @observed
  createPlayer(attributes: { name: string, splash: number}): void {
    return Player.create({ ...attributes, game: this });
  }

  @observed
  start() {
    if (this.players.length < 2) {
      throw new Error('legs requires at least 2 players to start');
    }
    this.started = true;
  }

  @observed
  scoreRound(player: Player, score: number): void {
    Round.create({ player, score, game: this });
  }

  calculateStrikes(player: Player): number {
    return this.rounds.reduce((strikes, round, idx) => {
      if (round.player === player) {
        if (this.rounds[idx - 1]?.score > round.score) {
          return strikes + 1;
        }
      }
      return strikes;
    }, 0);
  }

  get isStarted(): boolean {
    return !!this._started;
  }

  get isFinished(): boolean {
    return [
      this.isStarted,
      this.players.filter((player) => player.strikes < 3).length === 1,
    ].every((condition) => !!condition);
  }

  get playerOrder(): Player[] {
    const { players, rounds } = this;
    const order = players
      .filter((player) => player.strikes < 3)
      .sort((playerA, playerB) => playerB.splash - playerA.splash);

    const lastPlayer = rounds?.last?.player;
    if (!lastPlayer) return order;

    const lastPlayerIdx = order.findIndex(player => player === lastPlayer);
    if (lastPlayerIdx === order.length - 1) return order;

    const nextPlayerIdx = lastPlayerIdx + 1;

    return order.slice(nextPlayerIdx).concat(order.slice(0, nextPlayerIdx));
  }

  get targetScore(): number {
    return this.rounds.last?.score || 0;
  }

  get currentPlayer() {
    return this.playerOrder.first;
  }
}
