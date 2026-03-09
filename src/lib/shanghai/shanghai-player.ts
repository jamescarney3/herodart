import { Model, prop, key, hasMany, belongsTo, register } from '@jamescarney3/microrm';
import type Round from '~/lib/shanghai/shanghai-round';
import type { ShanghaiDarts } from '~/lib/shanghai/shanghai-round';
import type Game from '~/lib/shanghai/shanghai-game';

@register('shanghai-players')
export default class ShanghaiPlayer extends Model {
  @key declare name: string;
  @prop declare splash: number;

  @belongsTo('shanghai-games', { foreignKey: 'gameId' }) declare game: Game;
  @hasMany('shanghai-rounds', { foreignKey: 'playerName' }) declare rounds: Round[];

  get marks(): number {
    return this.rounds.reduce((marks, round) => marks + round.marks, 0);
  }

  get mpr(): number {
    return this.marks / (this.rounds.length || 1);
  }

  score(darts: ShanghaiDarts): void {
    this.game.scoreRound(this, darts);
  }
}
