import { BrowserRouter, Routes, Route } from 'react-router';

import { LegsGame, ShanghaiGame } from '~/pages';

function App() {
  return (
    <BrowserRouter basename="herodart">
      <Routes>
        <Route path="*" element={<LegsGame />} />
        <Route path="shanghai" element={<ShanghaiGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
