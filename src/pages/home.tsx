import { Link } from 'react-router';

const HomePage = () => {
  return (
    <div className="text-xl flex flex-col gap-4">
      <h1 className="text-center text-6xl mb-auto">Herodart</h1>
      <p>[[ welcome/description/about/etc ]]</p>
      <nav className="flex flex-col">
        <Link to="legs">Legs</Link>
      </nav>
    </div>
  );
};

export default HomePage;
