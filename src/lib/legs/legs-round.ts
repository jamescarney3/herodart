import Model, { prop, belongsTo } from '~/lib/v2/model';
import { register } from '~/lib/v2/store';
import type Player from '~/lib/legs/legs-player';
import type Game from '~/lib/legs/legs-game';

@register('legs-rounds')
export default class LegsRound extends Model {
  @prop declare score: number;

  @belongsTo('legs-games', { foreignKey: 'gameId' }) declare game: Game;
  @belongsTo('legs-players', { foreignKey: 'playerName' }) declare player: Player;

  get wasStrike(): boolean {
    const { rounds } = this.game;
    const previous = rounds[rounds.indexOf(this) - 1];
    return previous && (this.score < previous.score);
  }

  get wasEliminationRound(): boolean {
    const { rounds } = this.game;
    const strikes = rounds.slice(0, rounds.indexOf(this) + 1).reduce((count, round, idx) => {
      if (round.player === this.player) {
        return ((rounds[idx - 1]?.score ?? 0) > round.score) ? count + 1 : count;
      }
      return count;
    }, 0);
    return strikes >= 3;
  }
}
