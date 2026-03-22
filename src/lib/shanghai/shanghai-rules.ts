import { Model, prop, key, belongsTo, register } from '@jamescarney3/microrm';

import type { ShanghaiGame } from '~/lib/shanghai';

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
  @belongsTo('shanghai-game', { foreignKey: 'gameId' }) declare game: ShanghaiGame;

  @key declare id: string;
  @prop scoring = SCORING.MARKS;
  @prop elimination = ELIMINATION.NONE;
  @prop endWedge = END_WEDGE.TWENTY;
  @prop turnOrder = TURN_ORDER.BY_SHOT;
}
