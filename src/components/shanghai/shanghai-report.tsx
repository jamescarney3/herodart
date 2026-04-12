import type { ShanghaiGame, ShanghaiPlayer } from '~/lib/shanghai';
import { roundNumber } from '~/lib/utils';

interface ShanghaiReportProps {
  game: ShanghaiGame;
  onNewGame: () => void;
}

export enum WINNER_HEADING {
  SINGLE = 'Winner:',
  MULTIPLE = 'Winners (tie):',
}

const formatWinnersHeader = (winners: ShanghaiPlayer[]) => {
  if (winners.length === 1) return WINNER_HEADING.SINGLE;
  return WINNER_HEADING.MULTIPLE;
};

const ShanghaiReport = ({ game, onNewGame }: ShanghaiReportProps) => {
  return (
    <div className="h-screen flex flex-col gap-2 p-2">
      <section>
        {game.winners && (
          <>
            <h1 className="text-center text-6xl">{formatWinnersHeader(game.winners)}</h1>
            <table className="w-full">
              <thead>
                <tr className="[&>th]:text-left">
                  <th />
                  <th>Total</th>
                  <th>MPR</th>
                </tr>
              </thead>
              <tbody>
                {game.winners.map((player) => (
                  <tr key={`player-${player.name}`}>
                    <td>{player.name}</td>
                    <td>{player.totalScore}</td>
                    <td>{player.mpr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>

      <section>
        <h2 className="text-2xl border-bottom mt-4">Player Performance</h2>
        <table className="w-full">
          <thead>
            <tr className="[&>th]:text-left">
              <th />
              <th>MPR</th>
            </tr>
          </thead>
          <tbody>
            {game.players
              .sort((a, b) => b.splash - a.splash)
              .map((player) => (
                <tr key={`player-${player.name}`}>
                  <td>{player.name}</td>
                  <td>{roundNumber(player.mpr, 2)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      <section className="flex flex-col grow">
        <h2 className="text-2xl border-bottom mt-4">Game Log</h2>
        <div className="grow basis-0 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="[&>th]:text-left">
                <th>Wedge</th>
                <th>Player</th>
                <th>Score</th>
                {game.shanghaiScored && <th>Shanghai?</th>}
              </tr>
            </thead>
            <tbody>
              {game.rounds.map((round, idx) => (
                <tr key={`round-${idx}`}>
                  <td>{round.wedge}</td>
                  <td>{round.player.name}</td>
                  <td>{round.score}</td>
                  {game.shanghaiScored && <td>{round.isShanghai && <span>Shanghai!</span>}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <button onClick={onNewGame} className="w-full">
          new game
        </button>
      </section>
    </div>
  );
};

export default ShanghaiReport;
