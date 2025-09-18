#!/bin/bash

echo "🇺🇦 Запуск Ukrainian Language Learning App..."

# Переходим в корневую папку
cd "$(dirname "$0")"

# Функция для запуска backend
start_backend() {
    echo "🔧 Запуск backend..."
    cd backend

    ensure_env_file
    ensure_dependencies
    ensure_postgres
    ensure_prisma

    echo "🚀 Запуск NestJS сервера..."
    npm run start:dev
}

ensure_env_file() {
    if [ ! -f .env ]; then
        echo "📄 .env не найден, создаю из env.example"
        cp env.example .env
    fi
}

ensure_dependencies() {
    if [ ! -d node_modules ]; then
        echo "📦 Устанавливаю npm зависимости..."
        npm install --silent
    fi
}

ensure_postgres() {
    if ! command -v docker >/dev/null 2>&1; then
        echo "❌ Docker не установлен. Установите Docker или запустите PostgreSQL самостоятельно."
        exit 1
    fi

    local container_name="ualearn_db"

    if docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
        return
    fi

    if docker ps -a --format '{{.Names}}' | grep -q "^${container_name}$"; then
        echo "📊 Запуск существующего контейнера PostgreSQL..."
        docker start "${container_name}" >/dev/null
    else
        echo "📊 Создаю контейнер PostgreSQL..."
        docker run -d \
            --name "${container_name}" \
            -e POSTGRES_DB=ukrainian_app \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=postgres \
            -p 5432:5432 \
            postgres:15 >/dev/null
    fi

    echo "⏳ Ожидание старта PostgreSQL..."
    until docker exec "${container_name}" pg_isready --quiet >/dev/null 2>&1; do
        sleep 1
    done
}

ensure_prisma() {
    echo "🗂  Синхронизация схемы Prisma..."
    npx prisma generate >/dev/null
    npx prisma db push >/dev/null
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
        echo "📊 Или запустите сервисы вручную:"
        echo "   cd backend && npm run start:dev"
        echo "   cd frontend && npm start"
        ;;
esac
