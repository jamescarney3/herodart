import Model, { prop, belongsTo } from '~/lib/model';
import { collection } from '~/lib/store';
import type Game from '~/lib/legs/legs-game';
import type Player from '~/lib/legs/legs-player';

@collection
export default class LegsRound extends Model {
  static _storeKey = 'legs-rounds';

  @prop declare score: number;

  @belongsTo('legs-games', { foreignKey: 'gameId' }) declare game: Game;
  @belongsTo('legs-players', { foreignKey: 'playerName' }) declare player: Player;
}
