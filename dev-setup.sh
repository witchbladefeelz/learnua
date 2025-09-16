#!/bin/bash

echo "🇺🇦 Setting up Ukrainian Language Learning App for development..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"

# Check if PostgreSQL is running in Docker
if ! docker ps | grep -q ukrainian_app_db; then
    print_warning "PostgreSQL is not running. Starting it now..."
    docker-compose up postgres -d
    sleep 5
fi

print_status "PostgreSQL is running"

# Setup backend
echo ""
echo "🔧 Setting up backend..."
cd backend

# Install dependencies
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
fi

# Copy environment file
if [ ! -f ".env" ]; then
    print_status "Creating backend .env file..."
    cp env.example .env
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Run database migrations
print_status "Running database migrations..."
npx prisma db push

# Seed database
print_status "Seeding database..."
npm run db:seed

print_status "Backend setup complete!"

# Setup frontend
echo ""
echo "🎨 Setting up frontend..."
cd ../frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

# Copy environment file
if [ ! -f ".env" ]; then
    print_status "Creating frontend .env file..."
    cp env.example .env
fi

print_status "Frontend setup complete!"

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🚀 To start the development servers:"
echo "   Backend:  cd backend && npm run start:dev"
echo "   Frontend: cd frontend && npm start"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:3001"
echo "   API Docs:  http://localhost:3001/api"
echo "   Prisma Studio: npx prisma studio (in backend folder)"
echo ""
echo "📊 PostgreSQL is running in Docker on port 5432"
echo "🛑 To stop PostgreSQL: docker-compose down"
