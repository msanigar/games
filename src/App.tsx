import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameMenu from './components/GameMenu';
import TicTacToe from './components/TicTacToe';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Routes>
          <Route path="/" element={<GameMenu />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
