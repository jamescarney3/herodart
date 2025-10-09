import Model, { prop, key, hasMany, belongsTo } from '~/lib/v2/model';
import { register } from '~/lib/v2/store';
import type Round from '~/lib/legs/legs-round';

import type Game from '~/lib/legs/legs-game';

@register('legs-players')
export default class LegsPlayer extends Model {
  @key declare name: string;
  @prop declare splash: number;

  @belongsTo('legs-games', { foreignKey: 'gameId' }) declare game: Game;
  @hasMany('legs-rounds', { foreignKey: 'playerName' }) declare rounds: Round[];

  get strikes(): number {
    return this.game.calculateStrikes(this);
  }

  score(total: number): void {
    this.game.scoreRound(this, total);
  }
}
