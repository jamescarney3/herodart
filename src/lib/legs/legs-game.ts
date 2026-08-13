import { Model, prop, key, hasMany, type Collection, register } from '@jamescarney3/microrm';
import Player from '~/lib/legs/legs-player';
import Round from '~/lib/legs/legs-round';

@register('legs-games')
export default class LegsGame extends Model {
  @key declare id: string;
  // TODO: declared ok for now but find out right way to give this a default value, setting default
  // in class definition seems to overwrite getter/setter defined by @prop decorator
  @prop declare started: boolean;

  @hasMany declare legsPlayers: Collection<Player>;
  @hasMany declare legsRounds: Collection<Round>;

  createPlayer(attributes: { name: string; splash: number }): Player {
    return Player.create({ ...attributes, legsGame: this }) as Player;
  }

  start() {
    if (this.legsPlayers.length < 2) {
      throw new Error('legs requires at least 2 players to start');
    }
    this.started = true;
  }

  scoreRound(player: Player, score: number): void {
    Round.create({ legsPlayer: player, score, legsGame: this });
  }

  calculateStrikes(player: Player): number {
    return this.legsRounds.reduce((strikes, round, idx) => {
      if (round.legsPlayer === player) {
        if (this.legsRounds[idx - 1]?.score > round.score) {
          return strikes + 1;
        }
      }
      return strikes;
    }, 0);
  }

  scoreWouldBeStrike(score: number): boolean {
    if (!this.legsRounds.last) return false;
    return score < this.legsRounds.last.score;
  }

  scoreWouldEliminateCurrentPlayer(score: number): boolean {
    // if any players have strikes, at least one round has been shot so assert this.legsRounds.last
    return this.currentPlayer?.strikes === 2 && score < this.legsRounds.last!.score;
  }

  get finished(): boolean {
    return [this.started, this.legsPlayers.filter((player) => player.strikes < 3).length === 1].every(
      (condition) => !!condition,
    );
  }

  get canStart(): boolean {
    return this.legsPlayers.length >= 2 && !this.finished;
  }

  get winner(): Player | null {
    if (!this.finished) return null;
    return this.legsPlayers.find((player) => player.strikes < 3)!;
  }

  get playerOrder(): Collection<Player> {
    const { legsPlayers, legsRounds } = this;
    const order = legsPlayers.sort((playerA, playerB) => playerB.splash - playerA.splash);

    const lastPlayer = legsRounds?.last?.legsPlayer;
    if (!lastPlayer) return order as Collection<Player>;

    const lastPlayerIdx = order.findIndex((player) => player === lastPlayer);
    const currentPlayerIdx = lastPlayerIdx + 1;
    // no spreading or alse this is a vanilla JS array without collection convenience methods
    const wrappedOrder = order.slice(currentPlayerIdx).concat(order.slice(0, currentPlayerIdx));

    return wrappedOrder.filter((player: Player) => player.strikes < 3) as Collection<Player>;
  }

  get targetScore(): number {
    return this.legsRounds.last?.score || 0;
  }

  get currentPlayer() {
    return this.playerOrder.first;
  }
}
