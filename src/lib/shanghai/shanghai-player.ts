import { Model, prop, hasMany, belongsTo, register } from '@jamescarney3/microrm';

import type { ShanghaiGame, ShanghaiRound, ShanghaiRules } from '~/lib/shanghai';

@register('shanghai-players')
export default class ShanghaiPlayer extends Model {
  @prop declare name: string;
  @prop declare splash: number;

  @belongsTo declare shanghaiGame: ShanghaiGame;
  @hasMany declare shanghaiRounds: ShanghaiRound[];

  get totalScore(): number {
    return this.shanghaiRounds.reduce((total, round) => total + this.rules.calculateRoundScore(round), 0);
  }

  get eliminated(): boolean {
    return this.rules.playerEliminated(this);
  }

  get mpr(): number {
    return this.totalMarks / (this.shanghaiRounds.length || 1);
  }

  get missedOnce(): boolean {
    return this.shanghaiRounds.filter((round) => round.marks === 0).length === 1;
  }

  get missedTwice(): boolean {
    return this.shanghaiRounds.filter((round) => round.marks === 0).length === 2;
  }

  private get rules(): ShanghaiRules {
    return this.shanghaiGame.shanghaiRules;
  }

  private get totalMarks(): number {
    return this.shanghaiRounds.reduce((marks, round) => marks + round.marks, 0);
  }
}
