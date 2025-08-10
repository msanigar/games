import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlayerNameInputProps {
  onJoin: (playerName: string) => void;
  roomId: string;
}

const PlayerNameInput = ({ onJoin, roomId }: PlayerNameInputProps) => {
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setIsJoining(true);
      onJoin(playerName.trim());
    }
  };

  const copyRoomLink = () => {
    const roomLink = `${window.location.origin}/tic-tac-toe?room=${roomId}`;
    navigator.clipboard.writeText(roomLink);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-4">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-4 h-4" /> Back to menu
            </Link>
          </div>

          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Join Game</h1>
            <p className="text-gray-600">Enter your name to start playing</p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Room ID:</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-white px-3 py-1 rounded-lg text-sm font-mono text-gray-800 border">{roomId}</code>
                <button onClick={copyRoomLink} className="text-blue-600 hover:text-blue-800 text-sm underline">Copy Link</button>
              </div>
            </div>
          </div>

          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input id="playerName" type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Enter your name..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" required minLength={2} maxLength={20} disabled={isJoining} />
            </div>

            <motion.button type="submit" disabled={!playerName.trim() || isJoining} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isJoining ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Joining...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Join Game
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PlayerNameInput; 