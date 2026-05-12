#!/usr/bin/bash

# Get the script directory
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
BACKEND_DIR="$SCRIPT_DIR/hbnb-backend"
FRONTEND_DIR="$SCRIPT_DIR/hbnb-frontend"

# --- Backend Setup ---
echo "--- Setting up Backend ---"
cd "$BACKEND_DIR" || exit 1

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "Installing backend dependencies..."
pip install -r requirement.txt --quiet

# Initialize database if it doesn't exist
if [ ! -f "instance/development.db" ]; then
    echo "Initializing database..."
    mkdir -p instance
    cat schema.sql | sqlite3 instance/development.db
    cat seed.sql | sqlite3 instance/development.db
    cat sample_data.sql | sqlite3 instance/development.db
fi

# Start Backend
echo "Starting Backend..."
python run.py &
BACKEND_PID=$!

# --- Frontend Setup ---
echo "--- Setting up Frontend ---"
cd "$FRONTEND_DIR" || exit 1

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install --silent
fi

# Start Frontend
echo "Starting Frontend..."
npm run dev &
FRONTEND_PID=$!

# --- Shutdown Mechanism ---
cleanup() {
    echo ""
    echo "Shutting down..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "Stopped."
    exit 0
}

# Trap Ctrl+C (SIGINT) and SIGTERM
trap cleanup SIGINT SIGTERM

echo ""
echo "HBnB Application is running!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both."

# Keep the script running
wait
