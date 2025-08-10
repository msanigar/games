# 🎮 Game Suite

A modern multiplayer game suite built with React 19, TypeScript, Tailwind CSS, and PartyKit for real-time multiplayer functionality.

## 🎯 Games

- ✅ **Tic Tac Toe** - Real-time multiplayer with room-based gameplay
- 🚧 **Puzzle Slider Game** - Coming soon
- 🚧 **Memory Card Game** - Coming soon

## 🚀 Features

### 🎮 Tic Tac Toe Multiplayer
- **Real-time gameplay** with PartyKit WebSocket connections
- **Room-based multiplayer** - Share room links to invite friends
- **Player presence** - See who's online and their connection status
- **Turn-based validation** - Only your turn moves are allowed
- **Beautiful animations** - Smooth transitions and hover effects
- **Responsive design** - Works on desktop and mobile

### 🎨 UI/UX
- **Modern design** with gradient backgrounds and smooth animations
- **Player name input** before joining games
- **Room sharing** with one-click copy functionality
- **Connection status** indicators
- **Presence indicators** showing online players
- **Game state management** with proper win/draw detection

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Routing**: React Router DOM
- **Real-time**: PartyKit WebSocket server
- **Deployment**: Netlify (frontend) + Vercel (PartyKit)

## 📦 Getting Started

### Prerequisites
- Node.js 18.19.0+ (see `.nvmrc`)
- npm 10.2.4+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd games
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   # Terminal 1: Start PartyKit server
   npm run partykit:dev
   
   # Terminal 2: Start Vite dev server
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173
   - PartyKit: http://localhost:1999

## 🎮 How to Play

### Multiplayer Tic Tac Toe

1. **Enter your name** when prompted
2. **Copy the room link** to share with a friend
3. **Wait for opponent** to join the room
4. **Take turns** making moves on the 3x3 grid
5. **Win by getting 3 in a row** (horizontally, vertically, or diagonally)

### Room Management
- **Room IDs** are automatically generated or can be specified via URL
- **Room links** can be shared to invite specific players
- **Connection status** is shown in real-time
- **Player presence** shows who's currently online

## 🏗️ Project Structure

```
games/
├── src/
│   ├── components/
│   │   ├── GameMenu.tsx          # Main game selection menu
│   │   ├── TicTacToe.tsx         # Multiplayer Tic Tac Toe game
│   │   ├── PlayerNameInput.tsx    # Player name input component
│   │   └── PresenceIndicator.tsx  # Player presence display
│   ├── hooks/
│   │   └── usePartyKit.ts        # PartyKit WebSocket hook
│   └── App.tsx                   # Main app with routing
├── partykit/
│   └── tic-tac-toe.ts           # PartyKit server for Tic Tac Toe
├── partykit.json                 # PartyKit configuration
└── netlify.toml                  # Netlify deployment config
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server
npm run partykit:dev     # Start PartyKit server

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Deployment
npm run partykit:deploy  # Deploy PartyKit to Vercel
```

### Environment Setup

The app automatically detects development vs production:
- **Development**: Connects to `localhost:1999` for PartyKit
- **Production**: Connects to your deployed PartyKit domain

## 🚀 Deployment

### Frontend (Netlify)
1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables: None required

### Backend (PartyKit/Vercel)
1. Deploy PartyKit server: `npm run partykit:deploy`
2. Update the host URL in `src/hooks/usePartyKit.ts`
3. Configure environment variables if needed

## 🎯 Multiplayer Architecture

### PartyKit Server (`partykit/tic-tac-toe.ts`)
- **Room management** - Each game is a separate room
- **Player tracking** - Maintains player list with connection status
- **Game state sync** - Broadcasts moves and state changes
- **Turn validation** - Ensures only valid moves are processed
- **Win detection** - Server-side game logic for fairness

### Client-Side (`src/hooks/usePartyKit.ts`)
- **WebSocket connection** - Real-time communication
- **Message handling** - Processes server messages
- **Connection management** - Handles connect/disconnect events
- **Error handling** - Graceful fallbacks for connection issues

### Game Flow
1. **Player joins** → Server assigns symbol (X/O)
2. **Second player joins** → Game starts automatically
3. **Moves are sent** → Server validates and broadcasts
4. **State updates** → All players see changes in real-time
5. **Game ends** → Winner/draw is determined server-side

## 🔮 Future Enhancements

### Planned Features
- [ ] **Puzzle Slider Game** - OSRS-style sliding puzzles
- [ ] **Memory Card Game** - Dobble-style matching game
- [ ] **Global leaderboards** - Track wins across all games
- [ ] **Custom room names** - Let players choose room IDs
- [ ] **Spectator mode** - Watch games without playing
- [ ] **Chat system** - In-game messaging
- [ ] **Game history** - Replay previous games

### Technical Improvements
- [ ] **Authentication** - User accounts and profiles
- [ ] **Database integration** - Persistent game data
- [ ] **Advanced animations** - More sophisticated transitions
- [ ] **Mobile optimization** - Touch-friendly controls
- [ ] **Offline mode** - Local single-player games

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using React 19, TypeScript, Tailwind CSS, and PartyKit**
