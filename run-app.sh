#!/bin/bash

echo "🇺🇦 Запуск Ukrainian Language Learning App..."

# Переходим в корневую папку
cd "$(dirname "$0")"

# Функция для запуска backend
start_backend() {
    echo "🔧 Запуск backend..."
    cd backend
    
    # Проверяем, что PostgreSQL запущен
    if ! docker ps | grep -q ukrainian_app_db; then
        echo "📊 Запуск PostgreSQL..."
        cd ..
        docker-compose up postgres -d
        sleep 5
        cd backend
    fi
    
    echo "🚀 Запуск NestJS сервера..."
    npm run start:dev
}

# Функция для запуска frontend
start_frontend() {
    echo "🎨 Запуск frontend..."
    cd frontend
    echo "🌐 Запуск React сервера..."
    npm start
}

# Проверяем аргументы
case "$1" in
    "backend")
        start_backend
        ;;
    "frontend")
        start_frontend
        ;;
    *)
        echo "Использование:"
        echo "  $0 backend   # Запустить только backend"
        echo "  $0 frontend  # Запустить только frontend"
        echo ""
        echo "🚀 Для полного запуска откройте 2 терминала:"
        echo "   Терминал 1: ./run-app.sh backend"
        echo "   Терминал 2: ./run-app.sh frontend"
        echo ""
        echo "📊 Или запустите PostgreSQL и сервисы отдельно:"
        echo "   docker-compose up postgres -d"
        echo "   cd backend && npm run start:dev"
        echo "   cd frontend && npm start"
        ;;
esac
