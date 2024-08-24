import Model, { prop, key, belongsTo, hasMany } from '~/lib/model';
import { collection } from '~/lib/store';
import type Game from '~/lib/legs/legs-game';
import type Round from '~/lib/legs/legs-round';

@collection
export default class LegsPlayer extends Model {
  static _storeKey = 'legs-players';

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
