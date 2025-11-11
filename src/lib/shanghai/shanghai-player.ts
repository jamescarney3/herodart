import Model, { prop, key, hasMany, belongsTo } from '~/lib/v2/model';
import { register } from '~/lib/v2/store';
import type Round from '~/lib/shanghai/shanghai-round';
import type { ShanghaiDarts } from '~/lib/shanghai/shanghai-round';
import type Game from '~/lib/shanghai/shanghai-game';

@register('shanghai-players')
export default class ShanghaiPlayer extends Model {
  @key declare name: string;
  @prop declare splash: number;

  @belongsTo('shanghai-games', { foreignKey: 'gameId' }) declare game: Game;
  @hasMany('shanghai-rounds', { foreignKey: 'playerName' }) declare rounds: Round[];

  get marks() {
    return this.rounds.reduce((marks, round) => marks + round.marks, 0);
  }

  get mpr() {
    return this.marks / this.rounds.length;
  }

  score(darts: ShanghaiDarts): void {
    this.game.scoreRound(this, darts);
  }
}
