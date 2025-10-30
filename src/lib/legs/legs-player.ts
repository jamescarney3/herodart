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

  get average() {
    const totalScore = this.rounds.reduce((total, round) => total + round.score, 0);
    return totalScore / this.rounds.length;
  }

  get opponentAverage() {
    const { rounds } = this.game;
    const oppRounds = rounds.reduce((matched, round, idx) => {
      if (round.player === this && rounds[idx - 1]) {
        return matched.concat(rounds[idx - 1]);
      }
      return matched;
    }, []);
    const oppTotal = oppRounds.reduce((oppScore: number, round: Round) => oppScore + round.score, 0);
    return oppTotal / Math.max(oppRounds.length, 1);
  }

  score(total: number): void {
    this.game.scoreRound(this, total);
  }
}
