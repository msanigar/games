import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const games = [
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'Classic 3x3 grid game for two players',
    status: 'ready',
    path: '/tic-tac-toe',
    icon: '⭕',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'puzzle-slider',
    title: 'Puzzle Slider',
    description: 'OSRS-inspired sliding puzzle game',
    status: 'coming-soon',
    path: '#',
    icon: '🧩',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'memory-card',
    title: 'Memory Card',
    description: 'Dobble-style matching card game',
    status: 'coming-soon',
    path: '#',
    icon: '🃏',
    color: 'from-green-500 to-emerald-500'
  }
];

const GameMenu = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Game Suite
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          A collection of modern multiplayer games built with React 19, TypeScript, and real-time features.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
      >
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="game-card"
          >
            <div className="text-center">
              <div className={`text-4xl mb-4 bg-gradient-to-r ${game.color} bg-clip-text text-transparent`}>
                {game.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{game.title}</h3>
              <p className="text-gray-600 mb-4">{game.description}</p>
              
              {game.status === 'ready' ? (
                <Link to={game.path}>
                  <button className="game-button w-full">
                    Play Now
                  </button>
                </Link>
              ) : (
                <button 
                  className="px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed w-full"
                  disabled
                >
                  Coming Soon
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-12 text-center text-gray-500"
      >
        <p>Built with React 19 • TypeScript • Tailwind CSS • Framer Motion</p>
      </motion.div>
    </div>
  );
};

export default GameMenu; 