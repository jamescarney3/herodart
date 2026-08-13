import LegsGame from '~/lib/legs/legs-game';
import { roundNumber, LEGS_ELIMINATION, LEGS_STRIKE } from '~/lib/utils';
import { Container } from '~/components/layout';

interface LegsReportProps {
  game: LegsGame;
  onNewGame: () => void;
}

const LegsReport = ({ game, onNewGame }: LegsReportProps) => {
  return (
    <Container>
      <section>
        <h1 className="text-center text-6xl">Winner:</h1>
        <div className="text-center text-6xl">{game.winner?.name}</div>
        <div className="text-center text-4xl">Average: {roundNumber(game.winner!.average, 2)}</div>
        <div className="text-center text-4xl">Opp. Average: {roundNumber(game.winner!.opponentAverage, 2)}</div>
      </section>

      <section>
        <h2 className="text-2xl border-bottom mt-4">Player Performance</h2>
        <table className="w-full">
          <thead>
            <tr className="[&>th]:text-left">
              <th />
              <th>Turns</th>
              <th>Avg</th>
              <th>OAvg</th>
            </tr>
          </thead>
          <tbody>
            {game.legsPlayers
              .sort((a, b) => b.splash - a.splash)
              .map((player) => (
                <tr key={`player-${player.name}`}>
                  <td>{player.name}</td>
                  <td>{player.legsRounds.length}</td>
                  <td>{roundNumber(player.average, 2)}</td>
                  <td>{roundNumber(player.opponentAverage, 2)}</td>
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
                <th />
                <th>Player</th>
                <th>Score</th>
                <th>Strike</th>
              </tr>
            </thead>
            <tbody>
              {game.legsRounds.map((round, idx) => (
                <tr key={`round-${idx}`}>
                  <td>{idx + 1}</td>
                  <td>{round.legsPlayer.name}</td>
                  <td>{round.score}</td>
                  <td>
                    {round.wasStrike && <span>{LEGS_STRIKE}</span>}
                    {round.wasEliminationRound && <span>{LEGS_ELIMINATION}</span>}
                  </td>
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
    </Container>
  );
};

export default LegsReport;
