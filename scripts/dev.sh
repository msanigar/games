#!/bin/bash

# Exit on any error
set -e

echo "🎮 Starting Game Suite Development Environment"
echo "=============================================="

echo "🚀 Starting WebSocket server..."
echo "   - Server will run on: http://localhost:1999"
echo "   - WebSocket endpoint: ws://localhost:1999/tic-tac-toe/{roomId}"
echo ""

# Start WebSocket server in background
npm run dev:server &
SERVER_PID=$!

echo "🌐 Starting Vite dev server..."
echo "   - Frontend will run on: http://localhost:5173"
echo ""

# Start Vite in background
npm run dev &
VITE_PID=$!

echo "✅ Both servers are starting..."
echo ""
echo "📋 Development URLs:"
echo "   - Frontend: http://localhost:5173"
echo "   - WebSocket: ws://localhost:1999"
echo ""
echo "🎮 To test multiplayer:"
echo "   1. Open http://localhost:5173 in two browser tabs"
echo "   2. Enter different names in each tab"
echo "   3. Copy the room link from one tab to the other"
echo "   4. Start playing!"
echo ""
echo "🛑 To stop servers: Press Ctrl+C"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $SERVER_PID 2>/dev/null || true
    kill $VITE_PID 2>/dev/null || true
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT

# Wait for both processes
wait 