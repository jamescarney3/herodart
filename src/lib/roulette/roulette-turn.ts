import { Model, Collection, register, prop, belongsTo, hasMany } from '@jamescarney3/microrm';

import type RouletteGame from '~/lib/roulette/roulette-game';
import type RouletteRound from '~/lib/roulette/roulette-round';

@register('roulette-turns')
class RouletteTurn extends Model {
  @prop declare checkout: number;
  @prop declare ordinality: number;
  // @prop declare value: number; 3 dart minimum outs worth more??
  @belongsTo declare rouletteGame: RouletteGame;
  @hasMany declare rouletteRounds: Collection<RouletteRound>;

  get finished(): boolean {
    return this.rouletteGame.roulettePlayers.every((player) => {
      return player.rouletteRounds.some((round: RouletteRound) => round.rouletteTurn === this);
    });
  }
}

export default RouletteTurn;
