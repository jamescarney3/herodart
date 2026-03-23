import ShanghaiGame from '~/lib/shanghai/shanghai-game';
import { roundNumber } from '~/lib/utils';

interface ShanghaiReportProps {
  game: ShanghaiGame;
  onNewGame: () => void;
}

const ShanghaiReport = ({ game, onNewGame }: ShanghaiReportProps) => {
  return (
    <div className="h-screen flex flex-col gap-2 p-2">
      <section>
        {/* istanbul ignore start -- @preserve */}
        {game.tieWinners && (
          <>
            <h1 className="text-center text-6xl">Winners (tie):</h1>
            <table>
              <thead>
                <tr className="[&>th]:text-left">
                  <th />
                  <th>Marks</th>
                  <th>MPR</th>
                </tr>
              </thead>
              <tbody>
                {game.tieWinners.map((player) => (
                  <tr key={`player-${player.name}`}>
                    <td>{player.name}</td>
                    <td>{player.marks}</td>
                    <td>{player.mpr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {game.winner && (
          <>
            <h1 className="text-center text-6xl">Winner:</h1>
            <div className="text-center text-6xl">{game.winner.name}</div>
            <div className="text-center text-4xl">Marks: {game.winner.marks}</div>
            <div className="text-center text-4xl">MPR: {roundNumber(game.winner.mpr, 2)}</div>
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
                <th />
                <th>Player</th>
                <th>Marks</th>
                {game.shanghaiScored && <th>Shanghai?</th>}
              </tr>
            </thead>
            <tbody>
              {game.rounds.map((round, idx) => (
                <tr key={`round-${idx}`}>
                  <td>{idx + 1}</td>
                  <td>{round.player.name}</td>
                  <td>{round.marks}</td>
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
