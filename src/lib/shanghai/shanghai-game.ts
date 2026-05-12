import { Model, prop, key, hasOne, hasMany, register } from '@jamescarney3/microrm';
import type { Collection } from '@jamescarney3/microrm';

import { ShanghaiPlayer, ShanghaiRound, ShanghaiRules } from '~/lib/shanghai';
import type { ShanghaiDarts } from '~/lib/shanghai/shanghai-round';

@register('shanghai-games')
export default class ShanghaiGame extends Model {
  @key declare id: string;
  @prop declare started: boolean;

  @hasMany('shanghai-players', { foreignKey: 'gameId' }) declare players: Collection<ShanghaiPlayer>;
  @hasMany('shanghai-rounds', { foreignKey: 'gameId' }) declare rounds: Collection<ShanghaiRound>;
  @hasOne('shanghai-rules', { foreignKey: 'gameId' }) declare rules: ShanghaiRules;

  createPlayer(attributes: { name: string; splash?: number }): ShanghaiPlayer {
    const player = ShanghaiPlayer.create({ ...attributes, game: this }) as ShanghaiPlayer;
    player.splash = this.rules.generatePlayerOrderCalculator(player, attributes.splash)();
    return player;
  }

  start() {
    this.started = true;
  }

  scoreRound(player: ShanghaiPlayer, darts: ShanghaiDarts): void {
    ShanghaiRound.create({ player, darts, game: this });
  }

  playerExistsWithName(name: string): boolean {
    return this.players.map((p) => p.name).includes(name);
  }

  getWedgeByRound(round: ShanghaiRound): number {
    const { rounds } = this;
    const playerRounds = rounds.where({ player: round.player });
    return playerRounds.indexOf(round) + 1;
  }

  get canStart(): boolean {
    return this.players.length >= 2;
  }

  // ACTIVE PHASE

  get playerOrder(): Collection<ShanghaiPlayer> {
    const { players, rounds } = this;
    const order = players.sort((playerA, playerB) => playerB.splash - playerA.splash);

    const lastPlayer = rounds?.last?.player;
    if (!lastPlayer) return order as Collection<ShanghaiPlayer>;

    const lastPlayerIdx = order.findIndex((player) => player === lastPlayer);
    const currentPlayerIdx = lastPlayerIdx + 1;
    // no spreading or else this is a vanilla JS array without collection convenience methods
    const wrappedOrder = order.slice(currentPlayerIdx).concat(order.slice(0, currentPlayerIdx));

    return wrappedOrder as Collection<ShanghaiPlayer>;
  }

  get staticPlayerOrder(): Collection<ShanghaiPlayer> {
    const { players } = this;
    return players.sort((playerA, playerB) => playerB.splash - playerA.splash);
  }

  get currentPlayer(): ShanghaiPlayer | void {
    const { staticPlayerOrder, rounds } = this;
    const lastPlayer = rounds?.last?.player;
    const lastPlayerIdx = staticPlayerOrder.findIndex((player) => player === lastPlayer);
    const wrappedOrder = staticPlayerOrder.slice(lastPlayerIdx).concat(staticPlayerOrder.slice(0, lastPlayerIdx));
    return wrappedOrder.slice(1).where({ eliminated: false }).first;
  }

  get currentWedge(): number {
    const { currentPlayer } = this;
    return currentPlayer!.rounds.length + 1;
  }

  // END PHASE

  get bestTotalScore(): number | undefined {
    const { players } = this;
    return players
      .map((player: ShanghaiPlayer) => player.totalScore)
      .sort((a, b) => a - b)!
      .at(-1);
  }

  get shanghaiScored(): boolean {
    const { rounds } = this;
    return rounds.some((round) => round.isShanghai);
  }

  get finished(): boolean {
    const { started, players, shanghaiScored, allRoundsShot } = this;
    const singlePlayerRemaining = players.where({ eliminated: false }).length === 1;
    return started && (shanghaiScored || allRoundsShot || singlePlayerRemaining);
  }

  get playersRemaining(): ShanghaiPlayer[] {
    const { players } = this;
    return players.where({ eliminated: false });
  }

  get allRoundsShot(): boolean {
    const { playersRemaining } = this;
    const { endWedge } = this.rules;
    return playersRemaining.every((player) => player.rounds.length === endWedge);
  }

  get winners(): ShanghaiPlayer[] {
    const { players, rounds, shanghaiScored, finished, bestTotalScore } = this;

    if (!finished) return [];
    if (shanghaiScored) return [rounds.findBy((round: ShanghaiRound) => round.isShanghai)!.player];
    return players.reduce((winners, player) => {
      if (player.totalScore === bestTotalScore) {
        return [...winners, player];
      } else {
        return winners;
      }
    }, []);
  }
}
