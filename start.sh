#!/bin/bash

echo "🇺🇦 Starting Ukrainian Language Learning App..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

echo "🔧 Building and starting services..."

# Build and start all services
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are starting up!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend:  http://localhost:3000"
    echo "   Backend:   http://localhost:3001"
    echo "   API Docs:  http://localhost:3001/api"
    echo ""
    echo "📊 To view logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 To stop the application:"
    echo "   docker-compose down"
    echo ""
    echo "🗄️  Database will be initialized automatically on first run."
    echo "📝 Check the backend logs for database seeding status."
else
    echo "❌ Failed to start services. Check the logs:"
    docker-compose logs
    exit 1
fi
