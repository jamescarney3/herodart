import Model, { prop, belongsTo } from '~/lib/v2/model';
import { register } from '~/lib/v2/store';
import type Player from '~/lib/legs/legs-player';
import type Game from '~/lib/legs/legs-game';

@register('legs-rounds')
export default class LegsRound extends Model {
  static _storeKey = 'legs-rounds';

  @prop declare score: number;

  @belongsTo('legs-games', { foreignKey: 'gameId' }) declare game: Game;
  @belongsTo('legs-players', { foreignKey: 'playerName' }) declare player: Player;
}
