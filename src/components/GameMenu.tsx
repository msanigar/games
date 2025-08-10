import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gamepad2, Puzzle, Heart, Trophy, Users, Sparkles } from 'lucide-react';

const games = [
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'Classic 3x3 grid game for two players',
    status: 'ready',
    path: '/tic-tac-toe',
    icon: Gamepad2,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50'
  },
  {
    id: 'puzzle-slider',
    title: 'Puzzle Slider',
    description: 'OSRS-inspired sliding puzzle game',
    status: 'coming-soon',
    path: '#',
    icon: Puzzle,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50'
  },
  {
    id: 'memory-card',
    title: 'Memory Card',
    description: 'Dobble-style matching card game',
    status: 'coming-soon',
    path: '#',
    icon: Heart,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50'
  }
];

const GameMenu = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Game Suite
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-600" />
            <p className="text-xl text-gray-600">
              Modern multiplayer games built with React 19
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <p className="text-sm text-gray-500">
              TypeScript • Tailwind CSS • Framer Motion
            </p>
          </div>
        </motion.div>

        {/* Games Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${game.bgColor}`}
            >
              <div className="p-8">
                <div className="text-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${game.color} rounded-2xl mb-6 shadow-lg`}
                  >
                    <game.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{game.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{game.description}</p>
                  
                  {game.status === 'ready' ? (
                    <Link to={game.path}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="game-button w-full flex items-center justify-center gap-2"
                      >
                        <Gamepad2 className="w-5 h-5" />
                        Play Now
                      </motion.button>
                    </Link>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed w-full flex items-center justify-center gap-2"
                      disabled
                    >
                      <Puzzle className="w-5 h-5" />
                      Coming Soon
                    </motion.button>
                  )}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 pt-8 border-t border-gray-200"
        >
          <div className="flex items-center justify-center gap-4 text-gray-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Built with modern tech</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Multiplayer ready</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>Game suite</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GameMenu; 