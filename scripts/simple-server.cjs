const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store game rooms
const rooms = new Map(); // roomId -> { board, currentPlayer, gameStatus, winner, players: PlayerInfo[], nextStarter }
const GRACE_MS = 5000; // remove disconnected players after 5s

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const roomId = url.pathname.split('/').pop();
  const cid = url.searchParams.get('cid');

  ws.roomId = roomId;
  ws.playerId = cid || Math.random().toString(36).substring(2, 8);

  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      board: Array(9).fill(null),
      currentPlayer: 'X', // Player 1 (X) starts for a brand new session
      gameStatus: 'waiting',
      winner: null,
      players: [],
      nextStarter: 'O', // after first completed game/reset, alternate to O
    });
  }
  const gameState = rooms.get(roomId);

  let playerInfo = gameState.players.find(p => p.id === ws.playerId);
  if (playerInfo) {
    playerInfo.connected = true;
    playerInfo.disconnectedAt = null;
  } else {
    playerInfo = { id: ws.playerId, name: `Player ${gameState.players.length + 1}`, symbol: null, connected: true, disconnectedAt: null };
    gameState.players.push(playerInfo);
  }

  const connected = gameState.players.filter(p => p.connected);
  if (!connected.find(p => p.symbol === 'X') && playerInfo && !playerInfo.symbol) playerInfo.symbol = 'X';
  else if (!connected.find(p => p.symbol === 'O') && playerInfo && !playerInfo.symbol) playerInfo.symbol = 'O';
  gameState.gameStatus = connected.length >= 2 ? 'playing' : 'waiting';

  ws.send(JSON.stringify({ type: 'welcome', playerId: ws.playerId }));
  ws.send(JSON.stringify({ type: 'gameState', gameState }));

  broadcastToRoom(roomId, { type: 'playerUpdate', players: gameState.players });
  broadcastToRoom(roomId, { type: 'gameState', gameState });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      switch (message.type) {
        case 'join':
          handlePlayerJoin(ws, message.playerName);
          break;
        case 'move':
          handleMove(ws, message.index);
          break;
        case 'reset':
          handleReset(ws, /*alternate*/ true);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    const gs = rooms.get(ws.roomId);
    if (!gs) return;
    const player = gs.players.find(p => p.id === ws.playerId);
    if (player) {
      player.connected = false;
      player.disconnectedAt = Date.now();
    }
    if (gs.players.filter(p => p.connected).length < 2) {
      gs.gameStatus = 'waiting';
    }
    broadcastToRoom(ws.roomId, { type: 'playerUpdate', players: gs.players });
    broadcastToRoom(ws.roomId, { type: 'gameState', gameState: gs });
    scheduleCleanup(ws.roomId);
  });
});

function scheduleCleanup(roomId) {
  setTimeout(() => {
    const gs = rooms.get(roomId);
    if (!gs) return;
    const now = Date.now();
    const beforeCount = gs.players.length;
    gs.players = gs.players.filter(p => p.connected || (p.disconnectedAt == null) || (now - p.disconnectedAt < GRACE_MS));

    const connected = gs.players.filter(p => p.connected);
    gs.players.forEach(p => (p.symbol = null));
    if (connected[0]) connected[0].symbol = 'X';
    if (connected[1]) connected[1].symbol = 'O';

    gs.gameStatus = connected.length >= 2 ? 'playing' : 'waiting';

    if (beforeCount !== gs.players.length) {
      broadcastToRoom(roomId, { type: 'playerUpdate', players: gs.players });
      broadcastToRoom(roomId, { type: 'gameState', gameState: gs });
      if (gs.players.length === 0) {
        // reset the session for a fresh start next time
        resetGame(gs, /*alternate*/ false, /*newSession*/ true);
        broadcastToRoom(roomId, { type: 'reset', gameState: gs });
      }
    }
  }, GRACE_MS);
}

function handlePlayerJoin(ws, playerName) {
  const gs = rooms.get(ws.roomId);
  if (!gs) return;
  const player = gs.players.find(p => p.id === ws.playerId);
  if (player) {
    player.name = playerName || player.name;
    broadcastToRoom(ws.roomId, { type: 'playerUpdate', players: gs.players });
    broadcastToRoom(ws.roomId, { type: 'gameState', gameState: gs });
  }
}

function handleMove(ws, index) {
  const gs = rooms.get(ws.roomId);
  if (!gs) return;
  const player = gs.players.find(p => p.id === ws.playerId);
  if (!player || !player.connected || gs.gameStatus !== 'playing') return;
  if (gs.currentPlayer !== player.symbol) return;
  if (gs.board[index] !== null) return;

  gs.board[index] = player.symbol;

  const winner = checkWinner(gs.board);
  if (winner) {
    gs.winner = winner;
    gs.gameStatus = 'won';
    // Set who should start next game (the OTHER player)
    gs.nextStarter = gs.currentPlayer === 'X' ? 'O' : 'X';
  } else if (checkDraw(gs.board)) {
    gs.gameStatus = 'draw';
    // Set who should start next game (the OTHER player)
    gs.nextStarter = gs.currentPlayer === 'X' ? 'O' : 'X';
  } else {
    gs.currentPlayer = gs.currentPlayer === 'X' ? 'O' : 'X';
  }

  broadcastToRoom(ws.roomId, { type: 'move', index, symbol: player.symbol, gameState: gs });
  broadcastToRoom(ws.roomId, { type: 'gameState', gameState: gs });
}

function handleReset(ws, alternate) {
  const gs = rooms.get(ws.roomId);
  if (!gs) return;
  resetGame(gs, alternate, /*newSession*/ false);
  broadcastToRoom(ws.roomId, { type: 'reset', gameState: gs });
  broadcastToRoom(ws.roomId, { type: 'gameState', gameState: gs });
}

function resetGame(gs, alternate, newSession) {
  gs.board = Array(9).fill(null);
  if (newSession) {
    // new session: Player 1 (X) starts
    gs.currentPlayer = 'X';
    gs.nextStarter = 'O';
  } else {
    // existing session: alternate if requested and at least two players connected
    if (alternate && gs.players.filter(p => p.connected).length >= 2) {
      // use nextStarter as current (set by previous game end)
      gs.currentPlayer = gs.nextStarter || 'X';
      // DON'T flip nextStarter here - it gets set when the game ends
    } else {
      // default behavior
      gs.currentPlayer = 'X';
    }
  }
  gs.gameStatus = gs.players.filter(p => p.connected).length >= 2 ? 'playing' : 'waiting';
  gs.winner = null;
}

function checkWinner(board) {
  const winningCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function checkDraw(board) {
  return board.every(cell => cell !== null);
}

function broadcastToRoom(roomId, message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.roomId === roomId) {
      client.send(JSON.stringify(message));
    }
  });
}

const PORT = 1999;
server.listen(PORT, () => {
  console.log(`🎮 Simple WebSocket server running on port ${PORT}`);
  console.log(`🌐 WebSocket endpoint: ws://localhost:${PORT}/tic_tac_toe/{roomId}`);
}); 