# Cake Shop · Next.js Full Stack

Интернет-магазин тортов на Next.js (App Router) с полноценным бэкендом:

- каталог тортов из базы данных
- корзина с хранением в `localStorage`
- оформление заказа через API
- админ-страница для просмотра заказов по `ADMIN_API_KEY`
- Prisma + SQLite
- Docker и `docker-compose` для деплоя на сервер

## Технологии

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Prisma ORM
- SQLite
- Zod (валидация API)

## Быстрый старт (локально)

1. Установите зависимости:

```bash
npm install
```

2. Создайте и заполните БД:

```bash
npm run db:setup
```

3. Запустите dev-сервер:

```bash
npm run dev
```

Откройте `http://localhost:3000`.

## Скрипты

- `npm run dev` - запуск в режиме разработки
- `npm run build` - production-сборка
- `npm run start` - запуск production-сборки
- `npm run lint` - линтинг
- `npm run db:push` - применить схему Prisma в БД
- `npm run db:seed` - наполнить каталог тестовыми тортами
- `npm run db:setup` - `db:push` + `db:seed`

## Переменные окружения

Скопируйте `.env.example` в `.env` и при необходимости измените значения.

```env
DATABASE_URL="file:./dev.db"
ADMIN_API_KEY="replace-with-strong-admin-key"
NEXT_PUBLIC_STORE_NAME="Сладкий Слой"
```

## API

- `GET /api/cakes` - получить каталог тортов
- `POST /api/orders` - создать заказ
- `GET /api/orders` - получить список заказов (требует заголовок `x-admin-key`)

## Деплой на сервер через Docker

1. На сервере установите Docker и Docker Compose.
2. Загрузите проект и перейдите в папку `cake-shop`.
3. Создайте `.env` из `.env.example` и укажите надёжный `ADMIN_API_KEY`.
4. Запустите контейнер:

```bash
docker compose up -d --build
```

5. Приложение будет доступно на `http://<server-ip>:3000`.

Что уже настроено для сервера:

- production-сборка приложения внутри Docker
- автоматическое применение схемы Prisma при старте контейнера
- автоматический seed каталога
- persistent volume `cake_shop_data` для хранения SQLite-файла
- рестарт контейнера `unless-stopped`

## Админ-панель

Страница: `http://localhost:3000/admin`

Для просмотра заказов введите значение `ADMIN_API_KEY` из `.env`.

