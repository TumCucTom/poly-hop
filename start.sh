#!/bin/bash

echo "🎮 Starting Poly-Hop Webcam Platformer..."
echo "📹 Make sure your webcam is available and permissions are granted"
echo "🌐 Server will be available at: http://localhost:3001"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🚀 Starting server..."
node server.js 