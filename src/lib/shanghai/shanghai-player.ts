import { Model, prop, key, hasMany, belongsTo, register } from '@jamescarney3/microrm';

import type { ShanghaiGame, ShanghaiRound, ShanghaiRules } from '~/lib/shanghai';

@register('shanghai-players')
export default class ShanghaiPlayer extends Model {
  @key declare name: string;
  @prop declare splash: number;

  @belongsTo('shanghai-games', { foreignKey: 'gameId' }) declare game: ShanghaiGame;
  @hasMany('shanghai-rounds', { foreignKey: 'playerName' }) declare rounds: ShanghaiRound[];

  get totalScore(): number {
    return this.rounds.reduce((total, round) => total + this.rules.calculateRoundScore(round), 0);
  }

  get eliminated(): boolean {
    return this.rules.playerEliminated(this);
  }

  get mpr(): number {
    return this.totalMarks / (this.rounds.length || 1);
  }

  get missedOnce(): boolean {
    return this.rounds.filter((round) => round.marks === 0).length === 1;
  }

  get missedTwice(): boolean {
    return this.rounds.filter((round) => round.marks === 0).length === 2;
  }

  private get rules(): ShanghaiRules {
    return this.game.rules;
  }

  private get totalMarks(): number {
    return this.rounds.reduce((marks, round) => marks + round.marks, 0);
  }
}
