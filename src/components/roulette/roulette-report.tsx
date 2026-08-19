import { Container } from '~/components/layout';
import type RouletteGame from '~/lib/roulette/roulette-game';

const RouletteReport = ({ game, onNewGame }: { game: RouletteGame; onNewGame: () => void }) => {
  return (
    <Container>
      <section>
        <h1 className="text-center text-6xl">Winner:</h1>
        <div className="text-center text-6xl">
          {game.winner?.name} {game.winner?.totalScore}
        </div>
      </section>
      <section>
        <table className="w-full my-4">
          <caption className="text-left text-2xl border-bottom mt-4">High Checkout(s)</caption>
          <tbody>
            {game.highCheckoutRounds.map((round) => (
              <tr key={`checkout-${round.keyOrTemporaryKey}`}>
                <td>{round.roulettePlayer.name}</td>
                <td>{round.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="w-full my-4">
          <caption className="text-left text-2xl border-bottom mt-4">Player Performance</caption>
          <thead>
            <tr className="[&>th]:text-left">
              <th />
              <th>Score</th>
              <th>Checkouts</th>
            </tr>
          </thead>
          <tbody>
            {game.playerOrder.map((player) => (
              <tr key={`performance-${player.keyOrTemporaryKey}`}>
                <td>{player.name}</td>
                <td>{player.totalScore}</td>
                <td>{player.checkouts.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="mt-auto">
        <button onClick={onNewGame} className="w-full">
          new game
        </button>
      </section>
    </Container>
  );
};

export default RouletteReport;
