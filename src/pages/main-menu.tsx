import { Link } from 'react-router';

import { Container } from '~/components/layout';
import { KofiLink } from '~/components/shared';

const MainMenu = () => {
  return (
    <Container>
      <h1 className="text-center text-6xl">Herodart</h1>
      <p>Scoring app for local play:</p>
      <nav className="flex flex-col gap-2">
        <Link className="btn text-xl text-center" to="/legs">
          Legs
        </Link>
        <Link className="btn text-xl text-center" to="/shanghai">
          Shanghai
        </Link>
        <Link className="btn text-xl text-center" to="/roulette">
          Roulette (beta)
        </Link>
      </nav>
      <KofiLink className="m-auto mt-2 h-[2em]" />
    </Container>
  );
};

export default MainMenu;
