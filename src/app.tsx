import { BrowserRouter, Routes, Route } from 'react-router';

import { LegsGame } from '~/pages';

const standaloneChecks = [
  !!(window.navigator as typeof window.navigator & { standalone: boolean })?.standalone,
  window.matchMedia('(display-mode: standalone)').matches,
];

function App() {
  return (
    <BrowserRouter basename="herodart">
      <div className="fixed text-red-500 bg-gray-100 bg-opacity-50 text-xl">
        <div>navigator: {String(standaloneChecks[0])}</div>
        <div>matchMedia: {String(standaloneChecks[1])}</div>
      </div>
      <Routes>
        <Route path="*" element={<LegsGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
