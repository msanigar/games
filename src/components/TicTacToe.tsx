import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

type Player = 'X' | 'O';
type Board = (Player | null)[];
type GameStatus = 'playing' | 'won' | 'draw';

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winner, setWinner] = useState<Player | null>(null);
  const [playerNames, setPlayerNames] = useState({ X: 'Player X', O: 'Player O' });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = (board: Board): Player | null => {
    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const checkDraw = (board: Board): boolean => {
    return board.every(cell => cell !== null);
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameStatus !== 'playing') return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setWinner(winner);
      setGameStatus('won');
    } else if (checkDraw(newBoard)) {
      setGameStatus('draw');
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameStatus('playing');
    setWinner(null);
  };

  const Cell = ({ value, index }: { value: Player | null; index: number }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleCellClick(index)}
      disabled={value !== null || gameStatus !== 'playing'}
      className="w-20 h-20 bg-white border-2 border-gray-200 rounded-lg text-3xl font-bold disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
    >
      <AnimatePresence mode="wait">
        {value && (
          <motion.span
            key={value}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className={value === 'X' ? 'text-blue-600' : 'text-red-600'}
          >
            {value}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-block mb-4 text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Menu
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Tic Tac Toe
          </h1>
        </motion.div>

        {/* Game Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          {gameStatus === 'playing' && (
            <p className="text-lg text-gray-700">
              <span className="font-semibold">{playerNames[currentPlayer]}</span>'s turn
            </p>
          )}
          {gameStatus === 'won' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-green-600"
            >
              🎉 {playerNames[winner!]} wins!
            </motion.div>
          )}
          {gameStatus === 'draw' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-gray-600"
            >
              🤝 It's a draw!
            </motion.div>
          )}
        </motion.div>

        {/* Game Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-2 mb-8 bg-gray-100 p-4 rounded-xl"
        >
          {board.map((value, index) => (
            <Cell key={index} value={value} index={index} />
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-4"
        >
          <button
            onClick={resetGame}
            className="game-button"
          >
            {gameStatus === 'playing' ? 'Reset Game' : 'Play Again'}
          </button>
          
          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 bg-blue-600 rounded"></span>
              <span>{playerNames.X}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 bg-red-600 rounded"></span>
              <span>{playerNames.O}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TicTacToe; 