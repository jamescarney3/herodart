import { BrowserRouter, Routes, Route } from 'react-router';

import { Game } from '~/components/legs';
import Home from '~/pages/home';

function App() {
  return (
    <BrowserRouter basename="herodart">
      <Routes>
        <Route index element={<Home />} />
        <Route path='legs' element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
