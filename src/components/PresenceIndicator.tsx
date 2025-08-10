import { motion, AnimatePresence } from 'framer-motion';
import { Users, Wifi, WifiOff } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  symbol: 'X' | 'O' | null;
  connected: boolean;
}

interface PresenceIndicatorProps {
  players: Player[];
  currentPlayer: 'X' | 'O';
}

const PresenceIndicator = ({ players, currentPlayer }: PresenceIndicatorProps) => {
  const waitingForPlayers = players.length < 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-4 mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Players</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${waitingForPlayers ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
          <span className="text-xs text-gray-500">
            {waitingForPlayers ? 'Waiting...' : 'Ready'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                player.connected 
                  ? 'bg-gray-50 border border-gray-200' 
                  : 'bg-gray-100 border border-gray-300 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                {player.connected ? (
                  <Wifi className="w-3 h-3 text-green-500" />
                ) : (
                  <WifiOff className="w-3 h-3 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {player.name}
                </span>
                {player.symbol && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    player.symbol === 'X' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {player.symbol}
                  </span>
                )}
              </div>
              
              {player.connected && player.symbol === currentPlayer && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {waitingForPlayers && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center"
        >
          <p className="text-xs text-gray-500">
            Waiting for opponent to join...
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PresenceIndicator; 