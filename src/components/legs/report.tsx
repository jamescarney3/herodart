import LegsGame from '~/lib/legs/legs-game';
import { roundNumber } from '~/lib/utils';

interface LegsReportProps {
  game: LegsGame;
}

const LegsReport = ({ game }: LegsReportProps) => {
  return (
    <div className="h-screen flex flex-col gap-2 p-2">
      <section>
        <h1 className="text-center text-6xl">Winner:</h1>
        <div className="text-center text-6xl">{game.winner!.name}</div>
        <div className="text-center text-4xl">
          Average: {roundNumber(game.winner!.average, 2)}
        </div>
        <div className="text-center text-4xl">
          Opp. Average: {roundNumber(game.winner!.opponentAverage, 2)}
        </div>
      </section>

      <h2 className="text-2xl border-bottom mt-4">Player Performance</h2>
      <section>
        <table className="w-full">
          <thead>
            <tr className='[&>th]:text-left'>
              <th />
              <th>Turns</th>
              <th>Avg</th>
              <th>OAvg</th>
            </tr>
          </thead>
          <tbody>
            {game.players.sort((a, b) => b.splash - a.splash).map((player) => (
              <tr key={`player-${player.name}`}>
                <td>{player.name}</td>
                <td>{player.rounds.length}</td>
                <td>{roundNumber(player.average, 2)}</td>
                <td>{roundNumber(player.opponentAverage, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <h2 className="text-2xl border-bottom mt-4">Game Log</h2>
      <section className="flex-grow basis-0 overflow-auto">
        <table className="w-full">
          <thead>
            <tr className='[&>th]:text-left'>
              <th />
              <th>Player</th>
              <th>Score</th>
              <th>Strike</th>
            </tr>
          </thead>
          <tbody>
            {game.rounds.map((round, idx) => (
              <tr key={`round-${idx}`}>
                <td>{idx + 1}</td>
                <td>{round.player.name}</td>
                <td>{round.score}</td>
                <td>
                  {round.wasStrike && <span>❌</span>}
                  {round.wasEliminationRound && <span>💀</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default LegsReport;
