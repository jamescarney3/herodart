import { Model, prop, belongsTo, register } from '@jamescarney3/microrm';
import { sum } from 'mathjs';

import type { ShanghaiRules, ShanghaiPlayer, ShanghaiGame } from '~/lib/shanghai';

export type ShanghaiDarts = [number, number, number];

@register('shanghai-rounds')
export default class ShanghaiRound extends Model {
  @prop declare darts: ShanghaiDarts;

  @belongsTo declare shanghaiGame: ShanghaiGame;
  @belongsTo declare shanghaiPlayer: ShanghaiPlayer;

  get marks(): number {
    const { darts } = this;
    return sum(darts);
  }

  get score(): number {
    return this.rules.calculateRoundScore(this);
  }

  get wedge(): number {
    return this.shanghaiGame.getWedgeByRound(this);
  }

  get isShanghai(): boolean {
    return [3, 2, 1].every((value) => this.darts.includes(value));
  }

  // potentially better if this can be a has-one-through kind of relation
  private get rules(): ShanghaiRules {
    return this.shanghaiGame.shanghaiRules;
  }
}
