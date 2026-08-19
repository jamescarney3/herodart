import { Model, register, prop, belongsTo } from '@jamescarney3/microrm';

import RouletteTurn from '~/lib/roulette/roulette-turn';
import RoulettePlayer from '~/lib/roulette/roulette-player';

@register('roulette-rounds')
class RouletteRound extends Model {
  @prop declare score: number;
  //TODO:  first, second, third, etc
  // @prop declare darts: number;
  @belongsTo declare rouletteTurn: RouletteTurn;
  @belongsTo declare roulettePlayer: RoulettePlayer;

  get checkout() {
    return this.rouletteTurn.checkout === this.score;
  }
}

export default RouletteRound;
