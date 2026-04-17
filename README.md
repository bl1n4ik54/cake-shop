# Cake Shop · Next.js + Drizzle ORM

Интернет-магазин тортов на Next.js (App Router) с PostgreSQL и Drizzle ORM.

## Что внутри

- Каталог тортов из БД
- Корзина в `localStorage`
- Оформление заказа через API
- Админ-страница заказов по `ADMIN_API_KEY`
- Идемпотентная миграция БД (`scripts/db-migrate.mjs`)
- Сид каталога через Drizzle (`scripts/db-seed.ts`)

## Технологии

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Drizzle ORM + postgres-js
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

3. Укажи `DATABASE_URL` (и опционально `DIRECT_URL`).

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

- `npm run dev` — dev-сервер
- `npm run build` — production build
- `npm run start` — запуск production-сборки
- `npm run lint` — линтинг
- `npm run db:generate` — генерация SQL-миграций Drizzle (опционально)
- `npm run db:migrate` — идемпотентная миграция БД
- `npm run db:seed` — сид каталога
- `npm run db:deploy` — `db:migrate` + `db:seed`
- `npm run db:setup` — alias для `db:deploy`

## ENV

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
ADMIN_API_KEY="replace-with-strong-admin-key"
NEXT_PUBLIC_STORE_NAME="Sweet Layer"
```

`DIRECT_URL` опционален. Если он пустой, приложение использует `DATABASE_URL`.

## Railway

Для web-сервиса задай минимум:

- `DATABASE_URL` (reference на Postgres service)
- `ADMIN_API_KEY`
- `NEXT_PUBLIC_STORE_NAME`

`DIRECT_URL` можно задать тем же значением, но это не обязательно.

## API

- `GET /api/cakes`
- `POST /api/orders`
- `GET /api/orders` (нужен заголовок `x-admin-key`)
