import { Model, prop, belongsTo, register } from '@jamescarney3/microrm';
import type Player from '~/lib/legs/legs-player';
import type Game from '~/lib/legs/legs-game';

@register('legs-rounds')
export default class LegsRound extends Model {
  @prop declare score: number;

  @belongsTo declare legsGame: Game;
  @belongsTo declare legsPlayer: Player;

  get wasStrike(): boolean {
    const { legsRounds } = this.legsGame;
    const previous = legsRounds[legsRounds.indexOf(this) - 1];
    return !!(previous && this.score < previous.score);
  }

  get wasEliminationRound(): boolean {
    const { legsRounds } = this.legsGame;
    const strikes = legsRounds.slice(0, legsRounds.indexOf(this) + 1).reduce((count, round, idx) => {
      if (round.legsPlayer === this.legsPlayer) {
        return (legsRounds[idx - 1]?.score ?? 0) > round.score ? count + 1 : count;
      }
      return count;
    }, 0);
    return strikes >= 3;
  }
}
