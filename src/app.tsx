import { BrowserRouter, Routes, Route } from 'react-router';

import { MainMenu, LegsGame, ShanghaiGame } from '~/pages';
import { InstallModal } from '~/components/shared';

function App() {
  return (
    <BrowserRouter basename="herodart">
      {/* see https://vite.dev/guide/env-and-mode */}
      <InstallModal disabled={import.meta.env.DEV} />
      <Routes>
        <Route index={true} path="*" element={<MainMenu />} />
        <Route path="legs" element={<LegsGame />} />
        <Route path="shanghai" element={<ShanghaiGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
