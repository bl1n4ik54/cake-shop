# Cake Shop · Next.js Full Stack

Интернет-магазин тортов на Next.js (App Router) с Prisma и PostgreSQL.

## Что внутри

- каталог тортов из БД
- корзина в `localStorage`
- оформление заказа через API
- админка заказов с `ADMIN_API_KEY`
- Prisma ORM + миграции (`prisma/migrations`)
- готовый деплой на Vercel

## Технологии

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL
- Zod

## Локальный запуск

1. Установи зависимости:

```bash
npm install
```

2. Создай `.env`:

```bash
cp .env.example .env
```

3. Укажи `DATABASE_URL` и `DIRECT_URL` на твою Postgres БД.

4. Примени миграции и заполни каталог:

```bash
npm run db:migrate
npm run db:seed
```

5. Запусти проект:

```bash
npm run dev
```

## Скрипты

- `npm run dev` - dev-сервер
- `npm run build` - `prisma generate` + `prisma migrate deploy` + `next build`
- `npm run start` - запуск production-сборки
- `npm run lint` - линтинг
- `npm run db:push` - синхронизация схемы Prisma с БД
- `npm run db:migrate` - запуск миграций Prisma
- `npm run db:seed` - сид каталога тортов
- `npm run db:setup` - `db:push` + `db:seed`

## ENV

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST-POOLER:6543/DB_NAME?pgbouncer=true&connection_limit=1&schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
ADMIN_API_KEY="replace-with-strong-admin-key"
NEXT_PUBLIC_STORE_NAME="Сладкий Слой"
```

## Деплой на Vercel

1. Запушь проект в GitHub.
2. В Vercel импортируй репозиторий.
3. В `Project Settings -> Environment Variables` добавь:

- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_API_KEY`
- `NEXT_PUBLIC_STORE_NAME`

4. Запусти Deploy.

Важно: при сборке вызывается `prisma migrate deploy`, поэтому миграции применяются автоматически.

## API

- `GET /api/cakes`
- `POST /api/orders`
- `GET /api/orders` (нужен заголовок `x-admin-key`)

## Docker (локально/сервер)

```bash
docker compose up -d --build
```

Поднимутся:

- `db` (PostgreSQL)
- `web` (Next.js)

Сайт будет на `http://localhost:3000`.
