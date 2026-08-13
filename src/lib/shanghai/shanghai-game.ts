import { Model, prop, key, hasOne, hasMany, register } from '@jamescarney3/microrm';
import type { Collection } from '@jamescarney3/microrm';

import { ShanghaiPlayer, ShanghaiRound, ShanghaiRules } from '~/lib/shanghai';
import type { ShanghaiDarts } from '~/lib/shanghai/shanghai-round';

@register('shanghai-games')
export default class ShanghaiGame extends Model {
  @key declare id: string;
  @prop declare started: boolean;

  @hasMany declare shanghaiPlayers: Collection<ShanghaiPlayer>;
  @hasMany declare shanghaiRounds: Collection<ShanghaiRound>;
  @hasOne declare shanghaiRules: ShanghaiRules;

  createPlayer(attributes: { name: string; splash?: number }): ShanghaiPlayer {
    const player = ShanghaiPlayer.create({ ...attributes, shanghaiGame: this }) as ShanghaiPlayer;
    player.splash = this.shanghaiRules.generatePlayerOrderCalculator(player, attributes.splash)();
    return player;
  }

  start() {
    this.started = true;
  }

  scoreRound(player: ShanghaiPlayer, darts: ShanghaiDarts): void {
    ShanghaiRound.create({ shanghaiPlayer: player, darts, shanghaiGame: this });
  }

  getWedgeByRound(round: ShanghaiRound): number {
    const { shanghaiRounds } = this;
    const playerRounds = shanghaiRounds.where({ shanghaiPlayer: round.shanghaiPlayer });
    return playerRounds.indexOf(round) + 1;
  }

  get canStart(): boolean {
    return this.shanghaiPlayers.length >= 2 && !!this.shanghaiRules;
  }

  // ACTIVE PHASE

  get playerOrder(): Collection<ShanghaiPlayer> {
    const { shanghaiPlayers, shanghaiRounds } = this;
    const order = shanghaiPlayers.sort((playerA, playerB) => playerB.splash - playerA.splash);

    const lastPlayer = shanghaiRounds?.last?.shanghaiPlayer;
    if (!lastPlayer) return order as Collection<ShanghaiPlayer>;

    const lastPlayerIdx = order.findIndex((player) => player === lastPlayer);
    const currentPlayerIdx = lastPlayerIdx + 1;
    // no spreading or else this is a vanilla JS array without collection convenience methods
    const wrappedOrder = order.slice(currentPlayerIdx).concat(order.slice(0, currentPlayerIdx));

    return wrappedOrder as Collection<ShanghaiPlayer>;
  }

  get staticPlayerOrder(): Collection<ShanghaiPlayer> {
    const { shanghaiPlayers } = this;
    return shanghaiPlayers.sort((playerA, playerB) => playerB.splash - playerA.splash);
  }

  get currentPlayer(): ShanghaiPlayer | void {
    const { staticPlayerOrder, shanghaiRounds } = this;
    const lastPlayer = shanghaiRounds?.last?.shanghaiPlayer;
    const lastPlayerIdx = staticPlayerOrder.findIndex((player) => player === lastPlayer);
    const wrappedOrder = staticPlayerOrder.slice(lastPlayerIdx).concat(staticPlayerOrder.slice(0, lastPlayerIdx));
    return wrappedOrder.where({ eliminated: false }).at(1);
  }

  get currentWedge(): number {
    const { currentPlayer } = this;
    return currentPlayer!.shanghaiRounds.length + 1;
  }

  // END PHASE

  get bestTotalScore(): number | undefined {
    const { shanghaiPlayers } = this;
    return shanghaiPlayers
      .map((player: ShanghaiPlayer) => player.totalScore)
      .sort((a, b) => a - b)!
      .at(-1);
  }

  get shanghaiScored(): boolean {
    const { shanghaiRounds } = this;
    return shanghaiRounds.some((round) => round.isShanghai);
  }

  get finished(): boolean {
    const { started, playersRemaining, shanghaiScored, allRoundsShot } = this;
    const singlePlayerRemaining = playersRemaining.length < 2;
    return started && (shanghaiScored || allRoundsShot || singlePlayerRemaining);
  }

  get playersRemaining(): ShanghaiPlayer[] {
    const { shanghaiPlayers } = this;
    return shanghaiPlayers.where({ eliminated: false });
  }

  get allRoundsShot(): boolean {
    const { playersRemaining } = this;
    const { endWedge } = this.shanghaiRules;
    return playersRemaining.every((player) => player.shanghaiRounds.length === endWedge);
  }

  get winners(): ShanghaiPlayer[] {
    const { shanghaiPlayers, shanghaiRounds, shanghaiScored, finished, bestTotalScore, playersRemaining } = this;

    if (!finished) return [];
    if (shanghaiScored)
      return [shanghaiRounds.findBy((round: ShanghaiRound) => round.isShanghai)!.shanghaiPlayer as ShanghaiPlayer];
    if (playersRemaining.length === 1) {
      return playersRemaining;
    }
    return shanghaiPlayers.reduce((winners: ShanghaiPlayer[], player) => {
      if (player.totalScore === bestTotalScore) {
        return [...winners, player];
      } else {
        return winners;
      }
    }, []);
  }
}
