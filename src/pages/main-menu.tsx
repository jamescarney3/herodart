import { Link } from 'react-router';

const MainMenu = () => {
  return (
    <div className="h-screen flex flex-col p-2 gap-2">
      <h1 className="text-center text-6xl">Herodart</h1>
      <p>Scoring application for local play:</p>
      <nav className="flex flex-col gap-2">
        <Link className="btn text-xl text-center" to="/legs">Legs</Link>
        <Link className="btn text-xl text-center" to="/shanghai">Shanghai</Link>
      </nav>
    </div>
  );
};

export default MainMenu;
