import { Container } from '~/components/layout';
import { RoulettePlayerCard } from '~/components/roulette';
import type RouletteGame from '~/lib/roulette/roulette-game';

const RouletteScoreboard = ({ game }: { game: RouletteGame }) => {
  const scoreCheckout = () => {
    game.scoreRound(game.currentPlayer!, game.currentTurn!.checkout);
  };

  const scoreMiss = () => {
    game.scoreRound(game.currentPlayer!, 0);
  };

  return (
    <Container>
      <section className="h-48 flex flex-col shrink-0">
        <h1 className="text-center text-6xl">{game.currentPlayer?.name}</h1>
        <div className="text-center text-4xl">Checkout:</div>
        <div className="text-center text-9xl">{game.currentTurn?.checkout}</div>
      </section>
      <section className="text-2xl mt-10">
        <h2 className="hidden">player order</h2>
        <ol className="relative flex flex-col flex-shrink overflow-hidden gap-2">
          {game.playerOrder.map((player) => (
            <RoulettePlayerCard key={`player-${player.keyOrTemporaryKey}`} player={player} game={game} />
          ))}
        </ol>
      </section>
      <section className="mt-auto flex h-36 gap-2">
        <button className="btn btn-success w-full text-3xl" onClick={scoreCheckout}>
          checkout
        </button>
        <button className="btn btn-danger w-full text-3xl" onClick={scoreMiss}>
          miss
        </button>
      </section>
    </Container>
  );
};

export default RouletteScoreboard;
