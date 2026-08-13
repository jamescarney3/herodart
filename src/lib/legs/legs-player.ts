import { Model, prop, hasMany, belongsTo, register } from '@jamescarney3/microrm';
import type Round from '~/lib/legs/legs-round';
import type Game from '~/lib/legs/legs-game';

@register('legs-players')
export default class LegsPlayer extends Model {
  @prop declare name: string;
  @prop declare splash: number;

  @belongsTo declare legsGame: Game;
  @hasMany declare legsRounds: Round[];

  get strikes(): number {
    return this.legsGame.calculateStrikes(this);
  }

  get average() {
    const totalScore = this.legsRounds.reduce((total, round) => total + round.score, 0);
    return totalScore / this.legsRounds.length;
  }

  get opponentAverage() {
    const { legsRounds } = this.legsGame;
    const oppRounds = legsRounds.reduce((matched, round, idx) => {
      if (round.legsPlayer === this && legsRounds[idx - 1]) {
        return matched.concat(legsRounds[idx - 1]);
      }
      return matched;
    }, [] as Round[]);
    const oppTotal = oppRounds.reduce((oppScore: number, round: Round) => oppScore + round.score, 0);
    return oppTotal / Math.max(oppRounds.length, 1);
  }

  score(total: number): void {
    this.legsGame.scoreRound(this, total);
  }
}
