import { Model, prop, key, hasMany, hasOne, type Collection, register } from '@jamescarney3/microrm';
import Player from '~/lib/shanghai/shanghai-player';
import Round from '~/lib/shanghai/shanghai-round';
import { ShanghaiRules } from '~/lib/shanghai';
import type { ShanghaiDarts } from '~/lib/shanghai/shanghai-round';

const WEDGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

@register('shanghai-games')
export default class ShanghaiGame extends Model {
  @key declare id: string;
  // TODO: declared ok for now but find out right way to give this a default value, setting default
  // in class definition seems to overwrite getter/setter defined by @prop decorator
  @prop declare started: boolean;

  @hasMany('shanghai-players', { foreignKey: 'gameId' }) declare players: Collection<Player>;
  @hasMany('shanghai-rounds', { foreignKey: 'gameId' }) declare rounds: Collection<Round>;
  @hasOne('shanghai-rules', { foreignKey: 'gameId'}) declare rules: Collection<ShanghaiRules>;

  createPlayer(attributes: { name: string; splash: number }): Player {
    return Player.create({ ...attributes, game: this }) as Player;
  }

  start() {
    // check canStart and throw error if not?
    this.started = true;
  }

  getWedgeByRound(round: Round): number {
    const { players, rounds } = this;
    const roundIdx = rounds.findIndex(current => current === round);
    const playersCount = players.length;

    return (roundIdx - roundIdx % playersCount) / playersCount + 1;
  }

  scoreRound(player: Player, darts: ShanghaiDarts): void {
    Round.create({ player, darts, game: this });
  }

  playerExistsWithName(name: string): boolean {
    return this.players.map((p) => p.name).includes(name);
  }

  get canStart(): boolean {
    return this.players.length >= 2 && !this.started;
  }

  get bestMarks(): number | undefined {
    const { players } = this;
    return players.map((player: Player) => player.marks).sort()!.at(-1);
  }

  get shanghaiScored(): boolean {
    const { rounds } = this;
    return rounds.some((round) => round.isShanghai);
  }

  get finished(): boolean {
    const { rounds, players } = this;
    return rounds.length / players.length === WEDGES.length || this.shanghaiScored;
  }

  get tie(): boolean {
    if (this.shanghaiScored) return false;
    return (this.tieWinners ?? []).length >= 2;
  }

  get winner(): Player | null {
    const { players, rounds } = this;
    const shanghai = rounds.find((round) => round.isShanghai);

    if (!this.finished) return null;
    if (this.tie) return null;
    if (shanghai) return shanghai.player;
    // this is surely defined if the game is finished
    return players.sort((a: Player, b: Player) => b.marks - a.marks).first!;
  }

  get tieWinners(): Player[] | null {
    if (!this.finished) return null;
    const players = this.players.where({ marks: this.bestMarks });
    return players.length >= 2 ? players : null;
  }

  get playerOrder(): Collection<Player> {
    const { players, rounds } = this;
    const order = players.sort((playerA, playerB) => playerB.splash - playerA.splash);

    const lastPlayer = rounds?.last?.player;
    if (!lastPlayer) return order as Collection<Player>;

    const lastPlayerIdx = order.findIndex((player) => player === lastPlayer);
    const currentPlayerIdx = lastPlayerIdx + 1;
    // no spreading or alse this is a vanilla JS array without collection convenience methods
    const wrappedOrder = order.slice(currentPlayerIdx).concat(order.slice(0, currentPlayerIdx));

    return wrappedOrder as Collection<Player>;
  }

  get staticPlayerOrder(): Collection<Player> {
    const { players } = this;
    return players.sort((playerA, playerB) => playerB.splash - playerA.splash);
  }

  get currentPlayer(): Player | void {
    return this.playerOrder.first;
  }

  get currentWedge() : number {
    const { players, rounds } = this;
    const playersCount = players.length;
    const roundsCount = rounds.length;

    return (roundsCount - roundsCount % playersCount) / playersCount + 1;
    /**
     * alernative approaches using bitwise operators' integer cast
     *
     * bitwise OR casts quotient to integer and OR-transforms each bit with 0 preserving initial val
     * (roundsCount / playersCount + 1) | 0
     *
     * bitwise double negation casts quotient to integer and double NOT-flips each bit
     * ~~(roundsCount / playersCount + 1)
     */
  }
}
