import { BrowserRouter, Routes, Route } from 'react-router';

import { LegsGame } from '~/pages';

function App() {
  return (
    <BrowserRouter basename="herodart">
      <Routes>
        <Route path="*" element={<LegsGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
