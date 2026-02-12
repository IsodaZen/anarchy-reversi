import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GameRoom from './pages/GameRoom';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<GameRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
