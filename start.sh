#!/bin/bash
# Carbon Footprint Platform Startup Script

echo "🌍 Starting Carbon Footprint Platform..."

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed or not in PATH"
    exit 1
fi

# Start Docker Compose services
echo "Starting Docker containers..."
docker-compose up -d

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to start..."
sleep 5

# Start the backend
echo "Starting backend server..."
cd server
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start the frontend
echo "Starting frontend server..."
cd ../client
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Platform is starting!"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:5000"
echo "MongoDB: mongodb://admin:password123@localhost:27017"
echo ""
echo "To stop, press Ctrl+C"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
