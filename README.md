# Game Suite

A modern web application featuring a collection of multiplayer games built with React 19, TypeScript, Tailwind CSS, and Framer Motion.

## 🎮 Games

### ✅ Tic Tac Toe
- Classic 3x3 grid game for two players
- Beautiful animations and modern UI
- Win/draw detection with smooth transitions
- Local multiplayer (hotseat)

### 🧩 Puzzle Slider (Coming Soon)
- OSRS-inspired sliding puzzle game
- Multiple difficulty levels
- Real-time multiplayer support

### 🃏 Memory Card (Coming Soon)
- Dobble-style matching card game
- Fast-paced multiplayer gameplay
- Session-based rooms

## 🛠️ Tech Stack

- **Framework**: React 19 with hooks, suspense, and transitions
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Deployment**: Ready for Netlify/Vercel

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── GameMenu.tsx      # Landing page with game selection
│   └── TicTacToe.tsx    # Tic Tac Toe game component
├── App.tsx               # Main app with routing
├── main.tsx             # Entry point
└── index.css            # Tailwind CSS and custom styles
```

## 🎯 Features

- **Responsive Design**: Works on desktop and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Modern UI**: Clean, gradient-based design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Extensible**: Easy to add new games

## 🔮 Future Enhancements

### Multiplayer Backend Options

The project is designed to support real-time multiplayer features. We're evaluating these options:

1. **PartyKit** (Recommended)
   - Lightweight, built for real-time
   - Easy integration with React
   - Free tier available
   - Perfect for simple multiplayer games

2. **Supabase**
   - Full-featured backend
   - Real-time subscriptions
   - Auth and database included
   - Generous free tier

3. **Convex**
   - Reactive backend
   - Type-safe database
   - Built-in multiplayer support
   - Developer-friendly

## 🎨 Design System

- **Colors**: Indigo and purple gradients
- **Typography**: System fonts with custom gradients
- **Components**: Reusable game cards and buttons
- **Animations**: Smooth hover effects and transitions

## 📝 Development

### Adding New Games

1. Create a new component in `src/components/`
2. Add the route in `src/App.tsx`
3. Update the games array in `GameMenu.tsx`
4. Implement game logic with TypeScript

### Styling

- Use Tailwind CSS classes
- Custom components defined in `src/index.css`
- Framer Motion for animations
- Responsive design patterns

## 🚀 Deployment

The project is ready for deployment on:
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **Any static hosting**: Build with `npm run build`

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.
