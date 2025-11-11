import Model, { prop, belongsTo } from '~/lib/v2/model';
import { register } from '~/lib/v2/store';
import type Player from '~/lib/shanghai/shanghai-player';
import type Game from '~/lib/shanghai/shanghai-game';

export type ShanghaiDarts = [number, number, number];

@register('shanghai-rounds')
export default class ShanghaiRound extends Model {
  @prop declare darts: ShanghaiDarts;

  @belongsTo('shanghai-games', { foreignKey: 'gameId' }) declare game: Game;
  @belongsTo('shanghai-players', { foreignKey: 'playerName' }) declare player: Player;

  get marks(): number {
    return this.darts.reduce((total, marks) => total + marks, 0);
  }

  get wedge(): number {
    return this.game.getWedgeByRound(this);
  }

  get isShanghai(): boolean {
    return [3, 2, 1].every((value) => this.darts.includes(value));
  }
}
