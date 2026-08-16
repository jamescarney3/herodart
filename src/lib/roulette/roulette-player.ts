import { Model, Collection, register, prop, belongsTo, hasMany } from '@jamescarney3/microrm';

import RouletteGame from '~/lib/roulette/roulette-game';
import RouletteRound from '~/lib/roulette/roulette-round';

@register('roulette-players')
class RoulettePlayer extends Model {
  @prop declare ordinality: number;
  @hasMany declare rouletteRounds: Collection<RouletteRound>;
  @belongsTo declare rouletteGame: RouletteGame;

  get totalScore(): number {
    return this.rouletteRounds.reduce((current, round) => {
      return (round.score === round.rouletteTurn.checkout ? 1 : 0) + current;
    }, 0);
  }
}

export default RoulettePlayer;
