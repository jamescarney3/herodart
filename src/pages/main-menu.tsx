import { Link } from 'react-router';

import { KofiLink } from '~/components/shared';

const MainMenu = () => {
  return (
    <div className="h-screen flex flex-col p-2 gap-2">
      testing 123
      <h1 className="text-center text-6xl">Herodart</h1>
      <p>Scoring app for local play:</p>
      <nav className="flex flex-col gap-2">
        <Link className="btn text-xl text-center" to="/legs">
          Legs
        </Link>
        <Link className="btn text-xl text-center" to="/shanghai">
          Shanghai
        </Link>
      </nav>
      <KofiLink className="m-auto mt-2 h-[2em]" />
    </div>
  );
};

export default MainMenu;
