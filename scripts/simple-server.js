const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store game rooms
const rooms = new Map();

wss.on('connection', (ws, req) => {
  console.log('🔌 New WebSocket connection');
  
  // Extract room ID from URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const roomId = url.pathname.split('/').pop();
  
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      board: Array(9).fill(null),
      currentPlayer: 'X',
      gameStatus: 'waiting',
      winner: null,
      players: []
    });
  }
  
  const gameState = rooms.get(roomId);
  const playerId = Math.random().toString(36).substring(2, 8);
  
  // Add player to room
  const playerInfo = {
    id: playerId,
    name: `Player ${gameState.players.length + 1}`,
    symbol: null,
    connected: true
  };
  
  gameState.players.push(playerInfo);
  
  // Assign symbols
  if (gameState.players.length === 1) {
    playerInfo.symbol = 'X';
  } else if (gameState.players.length === 2) {
    playerInfo.symbol = 'O';
    gameState.gameStatus = 'playing';
  }
  
  // Send initial game state
  ws.send(JSON.stringify({
    type: 'gameState',
    gameState
  }));
  
  // Broadcast player update
  broadcastToRoom(roomId, {
    type: 'playerUpdate',
    players: gameState.players
  });
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('📨 Received message:', message.type);
      
      switch (message.type) {
        case 'join':
          handlePlayerJoin(roomId, playerId, message.playerName);
          break;
        case 'move':
          handleMove(roomId, playerId, message.index);
          break;
        case 'reset':
          handleReset(roomId);
          break;
      }
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('🔌 WebSocket disconnected');
    
    // Mark player as disconnected
    const player = gameState.players.find(p => p.id === playerId);
    if (player) {
      player.connected = false;
    }
    
    // If no players connected, reset game
    if (gameState.players.every(p => !p.connected)) {
      handleReset(roomId);
    } else {
      broadcastToRoom(roomId, {
        type: 'playerUpdate',
        players: gameState.players
      });
    }
  });
});

function handlePlayerJoin(roomId, playerId, playerName) {
  const gameState = rooms.get(roomId);
  const player = gameState.players.find(p => p.id === playerId);
  if (player) {
    player.name = playerName;
    broadcastToRoom(roomId, {
      type: 'playerUpdate',
      players: gameState.players
    });
  }
}

function handleMove(roomId, playerId, index) {
  const gameState = rooms.get(roomId);
  const player = gameState.players.find(p => p.id === playerId);
  
  if (!player || gameState.gameStatus !== 'playing') return;
  if (gameState.currentPlayer !== player.symbol) return;
  if (gameState.board[index] !== null) return;
  
  // Make the move
  gameState.board[index] = player.symbol;
  
  // Check for winner
  const winner = checkWinner(gameState.board);
  if (winner) {
    gameState.winner = winner;
    gameState.gameStatus = 'won';
  } else if (checkDraw(gameState.board)) {
    gameState.gameStatus = 'draw';
  } else {
    // Switch turns
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
  }
  
  // Broadcast the move
  broadcastToRoom(roomId, {
    type: 'move',
    index,
    symbol: player.symbol,
    gameState
  });
}

function handleReset(roomId) {
  const gameState = rooms.get(roomId);
  gameState.board = Array(9).fill(null);
  gameState.currentPlayer = 'X';
  gameState.gameStatus = gameState.players.length >= 2 ? 'playing' : 'waiting';
  gameState.winner = null;
  
  broadcastToRoom(roomId, {
    type: 'reset',
    gameState
  });
}

function checkWinner(board) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];
  
  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function checkDraw(board) {
  return board.every(cell => cell !== null);
}

function broadcastToRoom(roomId, message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

const PORT = 1999;
server.listen(PORT, () => {
  console.log(`🎮 Simple WebSocket server running on port ${PORT}`);
  console.log(`🌐 WebSocket endpoint: ws://localhost:${PORT}/tic-tac-toe/{roomId}`);
}); 