import type * as Party from "partykit/server";

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
  nextStarter: Player;
}

interface GameMessage {
  type: 'join' | 'move' | 'reset' | 'player-update';
  playerId?: string;
  playerName?: string;
  symbol?: Player;
  index?: number;
}

export default class TicTacToeRoom implements Party.Server {
  private gameState: GameState;
  private connections: Map<string, Party.Connection> = new Map();

  constructor(readonly party: Party.Party) {
    this.gameState = {
      board: Array(9).fill(null),
      currentPlayer: 'X',
      gameStatus: 'waiting',
      winner: null,
      players: [],
      nextStarter: 'O'
    };
  }

  async onConnect(ws: Party.Connection) {
    const playerId = ws.id;
    this.connections.set(playerId, ws);
    
    // Check if player already exists (reconnecting)
    let playerInfo = this.gameState.players.find(p => p.id === playerId);
    if (playerInfo) {
      playerInfo.connected = true;
    } else {
      // Add new player to the room
      playerInfo = {
        id: playerId,
        name: `Player ${this.gameState.players.length + 1}`,
        symbol: null,
        connected: true
      };
      this.gameState.players.push(playerInfo);
    }
    
    // Assign symbols to connected players
    const connectedPlayers = this.gameState.players.filter(p => p.connected);
    this.gameState.players.forEach(p => p.symbol = null);
    if (connectedPlayers[0]) connectedPlayers[0].symbol = 'X';
    if (connectedPlayers[1]) connectedPlayers[1].symbol = 'O';
    
    this.gameState.gameStatus = connectedPlayers.length >= 2 ? 'playing' : 'waiting';
    
    // Send welcome message with player ID
    ws.send(JSON.stringify({
      type: 'welcome',
      playerId: playerId
    }));
    
    // Send current game state to the new player
    ws.send(JSON.stringify({
      type: 'gameState',
      gameState: this.gameState
    }));
    
    // Broadcast player list update
    this.broadcastPlayerUpdate();
  }

  async onMessage(message: string, ws: Party.Connection) {
    try {
      const data: GameMessage = JSON.parse(message);
      const playerId = ws.id;
      
      switch (data.type) {
        case 'join':
          this.handlePlayerJoin(playerId, data.playerName || 'Anonymous');
          break;
          
        case 'move':
          this.handleMove(playerId, data.index!);
          break;
          
        case 'reset':
          this.handleReset();
          break;
          
        case 'player-update':
          this.handlePlayerUpdate(playerId, data.playerName!);
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  async onClose(ws: Party.Connection) {
    const playerId = ws.id;
    this.connections.delete(playerId);
    
    // Mark player as disconnected
    const player = this.gameState.players.find(p => p.id === playerId);
    if (player) {
      player.connected = false;
    }
    
    // Update game status if less than 2 connected players
    const connectedPlayers = this.gameState.players.filter(p => p.connected);
    if (connectedPlayers.length < 2) {
      this.gameState.gameStatus = 'waiting';
    }
    
    this.broadcastPlayerUpdate();
    this.broadcast({
      type: 'gameState',
      gameState: this.gameState
    });
    
    // Schedule cleanup of disconnected players after grace period
    setTimeout(() => this.cleanupDisconnectedPlayers(), 5000);
  }

  private handlePlayerJoin(playerId: string, playerName: string) {
    const player = this.gameState.players.find(p => p.id === playerId);
    if (player) {
      player.name = playerName;
      this.broadcastPlayerUpdate();
    }
  }

  private handleMove(playerId: string, index: number) {
    const player = this.gameState.players.find(p => p.id === playerId);
    if (!player || !player.connected || this.gameState.gameStatus !== 'playing') return;
    
    // Check if it's the player's turn
    if (this.gameState.currentPlayer !== player.symbol) return;
    
    // Check if the cell is empty
    if (this.gameState.board[index] !== null) return;
    
    // Make the move
    this.gameState.board[index] = player.symbol!;
    
    // Check for winner
    const winner = this.checkWinner(this.gameState.board);
    if (winner) {
      this.gameState.winner = winner;
      this.gameState.gameStatus = 'won';
      // Set who should start next game (the OTHER player)
      this.gameState.nextStarter = this.gameState.currentPlayer === 'X' ? 'O' : 'X';
    } else if (this.checkDraw(this.gameState.board)) {
      this.gameState.gameStatus = 'draw';
      // Set who should start next game (the OTHER player)
      this.gameState.nextStarter = this.gameState.currentPlayer === 'X' ? 'O' : 'X';
    } else {
      // Switch turns
      this.gameState.currentPlayer = this.gameState.currentPlayer === 'X' ? 'O' : 'X';
    }
    
    // Broadcast the move
    this.broadcast({
      type: 'move',
      index,
      symbol: player.symbol,
      gameState: this.gameState
    });
  }

  private handleReset() {
    this.resetGame(true);
    this.broadcast({
      type: 'reset',
      gameState: this.gameState
    });
  }

  private handlePlayerUpdate(playerId: string, playerName: string) {
    const player = this.gameState.players.find(p => p.id === playerId);
    if (player) {
      player.name = playerName;
      this.broadcastPlayerUpdate();
    }
  }

  private resetGame(alternate: boolean = true) {
    this.gameState.board = Array(9).fill(null);
    
    const connectedPlayers = this.gameState.players.filter(p => p.connected);
    if (alternate && connectedPlayers.length >= 2) {
      // Use nextStarter (set by previous game end)
      this.gameState.currentPlayer = this.gameState.nextStarter;
      // DON'T flip nextStarter here - it gets set when the game ends
    } else {
      // Default behavior for new sessions
      this.gameState.currentPlayer = 'X';
    }
    
    this.gameState.gameStatus = connectedPlayers.length >= 2 ? 'playing' : 'waiting';
    this.gameState.winner = null;
  }

  private checkWinner(board: Board): Player | null {
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

  private checkDraw(board: Board): boolean {
    return board.every(cell => cell !== null);
  }

  private broadcastPlayerUpdate() {
    this.broadcast({
      type: 'playerUpdate',
      players: this.gameState.players
    });
  }

  private cleanupDisconnectedPlayers() {
    const before = this.gameState.players.length;
    // Remove players who have been disconnected for more than the grace period
    this.gameState.players = this.gameState.players.filter(p => p.connected);
    
    // Reassign symbols to connected players
    const connectedPlayers = this.gameState.players.filter(p => p.connected);
    this.gameState.players.forEach(p => p.symbol = null);
    if (connectedPlayers[0]) connectedPlayers[0].symbol = 'X';
    if (connectedPlayers[1]) connectedPlayers[1].symbol = 'O';
    
    this.gameState.gameStatus = connectedPlayers.length >= 2 ? 'playing' : 'waiting';
    
    if (before !== this.gameState.players.length) {
      this.broadcastPlayerUpdate();
      this.broadcast({
        type: 'gameState',
        gameState: this.gameState
      });
      
      // If no players left, reset for fresh start
      if (this.gameState.players.length === 0) {
        this.resetGame(false);
        this.broadcast({
          type: 'reset',
          gameState: this.gameState
        });
      }
    }
  }

  private broadcast(message: any) {
    const messageStr = JSON.stringify(message);
    for (const connection of this.connections.values()) {
      connection.send(messageStr);
    }
  }
} 