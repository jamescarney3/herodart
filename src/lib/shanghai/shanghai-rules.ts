import { Model, prop, key, belongsTo, register } from '@jamescarney3/microrm';

import type { ShanghaiGame, ShanghaiRound, ShanghaiPlayer } from '~/lib/shanghai';

export enum SCORING {
  MARKS = 'MARKS',
  WEDGE = 'WEDGE',
}

export enum ELIMINATION {
  NONE = 'NONE',
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
}

export enum END_WEDGE {
  SEVEN = 7,
  NINE = 9,
  TWENTY = 20,
}

export enum TURN_ORDER {
  RANDOM = 'RANDOM',
  BY_SHOT = 'BY_SHOT',
  ENTRY = 'ENTRY',
}

@register('shanghai-rules')
export default class ShanghaiRules extends Model {
  @belongsTo('shanghai-games', { foreignKey: 'gameId' }) declare game: ShanghaiGame;

  @key declare id: string;
  @prop scoring: SCORING = SCORING.MARKS;
  @prop elimination: ELIMINATION = ELIMINATION.NONE;
  @prop endWedge: END_WEDGE = END_WEDGE.TWENTY;
  @prop turnOrder: TURN_ORDER = TURN_ORDER.BY_SHOT;

  calculateRoundScore(round: ShanghaiRound): number {
    const roundScores = {
      [SCORING.WEDGE]: round.wedge * round.marks,
      [SCORING.MARKS]: round.marks,
    };

    return roundScores[this.scoring];
  }

  playerEliminated(player: ShanghaiPlayer): boolean {
    const eliminationStates = {
      [ELIMINATION.SINGLE]: player.missedOnce,
      [ELIMINATION.DOUBLE]: player.missedTwice,
      [ELIMINATION.NONE]: false,
    };

    return eliminationStates[this.elimination];
  }

  // annoying side effect code but in order for this to actually be random it needs to happen at
  // runtime and it needs to happen once per player at max. should probably find a better way to do
  // this? idk, setting the splash val will be persistable if the player data has to get loaded from
  // some kind of persistence layer so maybe not so bad
  generatePlayerOrderCalculator(player: ShanghaiPlayer, splash: number = 0): () => number {
    const splashCalculators = {
      [TURN_ORDER.BY_SHOT]: () => splash,
      [TURN_ORDER.RANDOM]: Math.random,
      [TURN_ORDER.ENTRY]: () => 0 - this.game.players.indexOf(player),
    };

    return splashCalculators[this.turnOrder];
  }
}
