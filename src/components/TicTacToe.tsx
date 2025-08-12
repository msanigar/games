import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy, Users, Gamepad2, Crown, X, Circle, Copy } from 'lucide-react';
import { usePartyKit } from '../hooks/usePartyKit';
import PlayerNameInput from './PlayerNameInput';
import PresenceIndicator from './PresenceIndicator';

type Player = 'X' | 'O';
type Board = (Player | null)[];
type GameStatus = 'waiting' | 'playing' | 'won' | 'draw';

interface PlayerInfo {
  id: string;
  name: string;
  symbol: Player | null;
  connected: boolean;
}

interface GameState {
  board: Board;
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player | null;
  players: PlayerInfo[];
}

const TicTacToe = () => {
  const [searchParams] = useSearchParams();
  
  // Generate room ID only once and preserve it
  const roomId = useMemo(() => {
    const urlRoomId = searchParams.get('room');
    if (urlRoomId) {
      return urlRoomId;
    }
    // Generate a new room ID only if none exists
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    // Update URL without triggering a re-render
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('room', newRoomId);
    window.history.replaceState({}, '', newUrl.toString());
    return newRoomId;
  }, []); // Empty dependency array ensures this only runs once
  
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    gameStatus: 'waiting',
    winner: null,
    players: []
  });
  
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);

  // Connect to PartyKit only when playerName is set
  const { isConnected, send } = usePartyKit({
    room: roomId,
    enabled: !!playerName,
    onMessage: (message) => {
      switch (message.type) {
        case 'welcome':
          setMyPlayerId(message.playerId as string);
          // If we already have a name, send it now
          if (playerName) {
            send({ type: 'join', playerName });
          }
          break;
        case 'gameState':
        case 'move':
        case 'reset':
          setGameState(message.gameState as GameState);
          break;
        case 'playerUpdate':
          setGameState(prev => ({ ...prev, players: message.players as PlayerInfo[] }));
          break;
      }
    },
    onOpen: () => {},
    onClose: () => {},
    onError: () => {},
  });

  const handleJoin = (name: string) => {
    setPlayerName(name);
    // The connection will start when enabled flips to true; the 'welcome' handler will send join
  };

  const handleCellClick = (index: number) => {
    console.log('🎯 Cell clicked:', { index, gameStatus: gameState.gameStatus, currentPlayer: gameState.currentPlayer });
    
    if (gameState.board[index] || gameState.gameStatus !== 'playing') {
      console.log('❌ Cell click rejected:', { cellOccupied: !!gameState.board[index], gameStatus: gameState.gameStatus });
      return;
    }
    
    // Only allow moves if it's your turn and you have a symbol
    const me = gameState.players.find(p => p.id === myPlayerId);
    console.log('👤 My player info:', { me, myPlayerId, players: gameState.players });
    
    if (!me || me.symbol !== gameState.currentPlayer) {
      console.log('❌ Move rejected:', { playerExists: !!me, mySymbol: me?.symbol, currentPlayer: gameState.currentPlayer });
      return;
    }
    
    console.log('✅ Sending move:', { type: 'move', index });
    // Send move to server
    send({
      type: 'move',
      index
    });
  };

  const handleReset = () => {
    send({
      type: 'reset'
    });
  };

  const copyRoomLink = () => {
    const roomLink = `${window.location.origin}/tic-tac-toe?room=${roomId}`;
    navigator.clipboard.writeText(roomLink);
  };

  // Remove the problematic useEffect that was overriding the server-assigned player ID

  const Cell = ({ value, index }: { value: Player | null; index: number }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleCellClick(index)}
      disabled={value !== null || gameState.gameStatus !== 'playing'}
      className="w-20 h-20 bg-white border-2 border-gray-200 rounded-lg disabled:cursor-not-allowed hover:bg-gray-50 transition-colors relative overflow-hidden flex items-center justify-center"
    >
      <AnimatePresence mode="wait">
        {value && (
          <motion.div
            key={value}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className={`${value === 'X' ? 'text-blue-600' : 'text-red-600'} relative z-10`}
          >
            {value === 'X' ? (
              <X className="w-8 h-8 stroke-[3]" />
            ) : (
              <Circle className="w-8 h-8 stroke-[3]" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hover effect */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg"
      />
    </motion.button>
  );

  // Show player name input if not joined yet
  if (!playerName) {
    return <PlayerNameInput onJoin={handleJoin} roomId={roomId} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition-colors group">
            <motion.div
              whileHover={{ x: -3 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.div>
            <span className="group-hover:underline">Back to Menu</span>
          </Link>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tic Tac Toe
            </h1>
          </div>

          {/* Room Info */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm">
              <span className="text-xs text-gray-600">Room:</span>
              <code className="text-sm font-mono text-gray-800">{roomId}</code>
              <button
                onClick={copyRoomLink}
                className="text-blue-600 hover:text-blue-800"
                title="Copy room link"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          </div>
        </motion.div>

        {/* Presence Indicator */}
        <PresenceIndicator 
          players={gameState.players} 
          currentPlayer={gameState.currentPlayer} 
        />

        {/* Connection Status */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-4 p-3 bg-yellow-100 rounded-lg"
          >
            <p className="text-sm text-yellow-800">
              🔌 Connecting to game server...
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              If this persists, start the server with: <code className="bg-yellow-200 px-1 rounded">npm run dev:full</code>
            </p>
          </motion.div>
        )}

        {/* Offline Mode Indicator */}
        {!isConnected && gameState.players.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-4 p-3 bg-blue-100 rounded-lg"
          >
            <p className="text-sm text-blue-800">
              🎮 Offline Mode - UI testing only
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Start the server for real multiplayer: <code className="bg-blue-200 px-1 rounded">npm run dev:full</code>
            </p>
          </motion.div>
        )}

        {/* Game Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          {gameState.gameStatus === 'waiting' && (
            <div className="flex items-center justify-center gap-3">
              <Users className="w-5 h-5 text-gray-600" />
              <p className="text-lg text-gray-700">
                Waiting for opponent to join...
              </p>
            </div>
          )}
          {gameState.gameStatus === 'playing' && (
            <div className="flex items-center justify-center gap-3">
              <Users className="w-5 h-5 text-gray-600" />
              <p className="text-lg text-gray-700">
                <span className="font-semibold">
                  {gameState.players.find(p => p.symbol === gameState.currentPlayer)?.name || 'Unknown'}
                </span>'s turn
              </p>
            </div>
          )}
          {gameState.gameStatus === 'won' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center gap-3 text-2xl font-bold text-green-600"
            >
              <Crown className="w-6 h-6" />
              <span>🎉 {gameState.players.find(p => p.symbol === gameState.winner)?.name || 'Unknown'} wins!</span>
            </motion.div>
          )}
          {gameState.gameStatus === 'draw' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center gap-3 text-2xl font-bold text-gray-600"
            >
              <Trophy className="w-6 h-6" />
              <span>🤝 It's a draw!</span>
            </motion.div>
          )}
        </motion.div>

        {/* Game Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl shadow-lg">
            <div className="grid grid-cols-3 gap-3 w-fit mx-auto">
              {gameState.board.map((value, index) => (
                <Cell key={index} value={value} index={index} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="game-button flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {gameState.gameStatus === 'playing' ? 'Reset Game' : 'Play Again'}
          </motion.button>
          
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <X className="w-4 h-4 text-blue-600 stroke-[2]" />
              <span className="text-gray-700">Player X</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Circle className="w-4 h-4 text-red-600 stroke-[2]" />
              <span className="text-gray-700">Player O</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TicTacToe; 