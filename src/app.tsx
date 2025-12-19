import { BrowserRouter, Routes, Route } from 'react-router';

import { LegsGame, ShanghaiGame } from '~/pages';
import { InstallModal } from '~/components/shared';

function App() {
  return (
    <BrowserRouter basename="herodart">
      <InstallModal />
      <Routes>
        <Route path="*" element={<LegsGame />} />
        <Route path="shanghai" element={<ShanghaiGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
