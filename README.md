# 🇺🇦 UAlearn - Ukrainian Language Learning App

Free web application for learning Ukrainian language with simple and fast lessons.

## 🚀 Технологии

- **Frontend**: React 18 + TypeScript + TailwindCSS + PWA
- **Backend**: NestJS + Prisma + PostgreSQL
- **Инфраструктура**: Docker + Docker Compose

## 📋 Функции MVP

- ✅ Регистрация и авторизация (Email + JWT)
- ✅ Профиль пользователя с прогрессом
- ✅ Тематические уроки (Приветствия, Еда, Семья, Путешествия)
- ✅ Типы упражнений:
  - Множественный выбор
  - Сборка предложения из слов
  - Ввод текста
  - Аудио упражнения
- ✅ Система прогресса и геймификация (XP, Streak, Уровни, Бейджи)
- 🔄 Лидерборд (планируется)

## 🛠 Установка и запуск

### Предварительные требования
- Docker (для базы данных)
- Node.js 18+ 
- npm или yarn

### 🚀 Быстрый старт

```bash
./run-app.sh backend   # автоматически запустит/создаст PostgreSQL, установит зависимости и стартует NestJS
./run-app.sh frontend  # запустит React dev-сервер
```

После запуска:
- 🌐 Frontend: http://localhost:3000  
- 🔧 Backend API: http://localhost:3001  
- 📚 Swagger: http://localhost:3001/api

> По умолчанию подтверждение почты выключено (`EMAIL_VERIFICATION_ENABLED=false`), поэтому регистрация сразу создаёт активный аккаунт. В production поменяйте значение на `true`, чтобы отправлялись письма и требовалась активация.

### 🐳 Запуск в Docker

```bash
cp .env.example .env       # один раз скопировать файл окружения
docker compose up --build  # поднимет postgres + backend + frontend
```

- Frontend: http://localhost:3000  
- Backend:  http://localhost:3001  
- Swagger:  http://localhost:3001/api  

Остановить: `docker compose down`. Каждый сервис можно отключить в Docker Desktop индивидуально.

### 🐳 Docker вариант

Если у вас есть проблемы с Node.js, можете использовать Docker:

```bash
# Только база данных
docker-compose up postgres -d

# Полный стек (если Docker Buildx работает)
docker-compose up --build
```

### 🔧 Разработка

#### Backend разработка
```bash
cd backend
npm install
npm run start:dev          # Запуск в dev режиме
npm run prisma:studio      # Prisma Studio для БД
npm run prisma:migrate     # Создать миграцию
```

#### Frontend разработка
```bash
cd frontend
npm install
npm start                  # Запуск dev сервера
npm run build             # Сборка для продакшена
```

### 📱 Тестирование PWA

1. Соберите фронтенд: `npm run build`
2. Запустите статический сервер: `npx serve -s build`
3. Откройте в мобильном браузере
4. Добавьте на домашний экран

## 📁 Структура проекта

```
ukrainian-app/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Авторизация
│   │   ├── users/          # Пользователи
│   │   ├── lessons/        # Уроки
│   │   ├── progress/       # Прогресс
│   │   └── database/       # Prisma схема
│   ├── prisma/
│   └── Dockerfile
├── frontend/               # React приложение
│   ├── src/
│   │   ├── components/     # Компоненты
│   │   ├── pages/          # Страницы
│   │   ├── hooks/          # Кастомные хуки
│   │   ├── services/       # API сервисы
│   │   └── types/          # TypeScript типы
│   ├── public/
│   └── Dockerfile
└── docker-compose.yml
```

## 🎮 Игровые механики

### Система очков (XP)
- Завершение урока: +10 XP
- Правильный ответ: +1 XP
- Идеальное прохождение: +5 XP бонус

### Streak система
- Ежедневная активность
- Бонусы за длинные серии

### Уровни
- A1 (Начинающий): 0-100 XP
- A2 (Базовый): 101-300 XP
- B1 (Средний): 301-600 XP
- B2 (Выше среднего): 601+ XP

## 🏆 Достижения и бейджи

- 🔥 "Первые шаги" - завершить первый урок
- 📚 "Книжный червь" - завершить 10 уроков
- ⚡ "Молния" - 7 дней streak
- 🌟 "Звезда" - достичь уровня B1

## 📱 PWA функции

- Офлайн доступ к пройденным урокам
- Push уведомления о напоминаниях
- Установка на домашний экран
- Оптимизация для мобильных устройств

## 🔧 API Endpoints

### Авторизация
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `GET /auth/profile` - Профиль пользователя
- `GET /auth/verify-email` - Подтвердить почту по токену
- `POST /auth/resend-verification` - Повторно отправить письмо подтверждения

### Уроки
- `GET /lessons` - Список уроков
- `GET /lessons/:id` - Детали урока
- `POST /lessons/:id/complete` - Завершить урок

### Прогресс
- `GET /progress` - Прогресс пользователя
- `POST /progress/update` - Обновить прогресс

## 📧 Подтверждение почты

- После регистрации пользователю отправляется письмо с подтверждением.
- Без подтверждения почты вход в систему недоступен.
- Настройка SMTP осуществляется через переменные окружения в `backend/env.example` (пример конфигурации для Gmail уже добавлен).
- Ссылка из письма ведёт на `/verify-email?token=...`, где фронтенд завершает процесс подтверждения.

## 📄 Лицензия

MIT License - свободно для образовательных целей.
# ualearn
# ualearn
# learnua
