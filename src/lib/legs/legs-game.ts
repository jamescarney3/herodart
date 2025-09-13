import Model, { prop, key, hasMany } from '~/lib/v2/model';
import { register } from '~/lib/v2/store';
import type Collection from '~/lib/v2/collection';
import Player from '~/lib/legs/legs-player';
import Round from '~/lib/legs/legs-round';

@register('legs-games')
export default class LegsGame extends Model {
  static _storeKey = 'legs-games';

  @key id: string;
  @prop started: boolean = false;

  @hasMany('legs-players', { foreignKey: 'gameId' }) declare players: Collection<Player>;
  @hasMany('legs-rounds', { foreignKey: 'gameId' }) declare rounds: Collection<Round>;

  createPlayer(attributes: { name: string, splash: number}): Player {
    return Player.create({ ...attributes, game: this }) as Player;
  }

  start() {
    if (this.players.length < 2) {
      throw new Error('legs requires at least 2 players to start');
    }
    this.started = true;
  }

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

  get finished(): boolean {
    return [
      this.started,
      this.players.filter((player) => player.strikes < 3).length === 1,
    ].every((condition) => !!condition);
  }

  get playerOrder(): Collection<Player> {
    const { players, rounds } = this;
    const order = players
      .filter((player) => player.strikes < 3)
      .sort((playerA, playerB) => playerB.splash - playerA.splash);

    const lastPlayer = rounds?.last?.player;
    if (!lastPlayer) return order as unknown as Collection<Player>;

    const lastPlayerIdx = order.findIndex(player => player === lastPlayer);
    if (lastPlayerIdx === order.length - 1) return order as unknown as Collection<Player>;

    const nextPlayerIdx = lastPlayerIdx + 1;

    return order.slice(nextPlayerIdx).concat(order.slice(0, nextPlayerIdx)) as unknown as Collection<Player>;
  }

  get targetScore(): number {
    return this.rounds.last?.score || 0;
  }

  get currentPlayer() {
    return this.playerOrder.first;
  }
}
