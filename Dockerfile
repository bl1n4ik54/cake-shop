FROM node:22-alpine

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build?schema=public \
    DIRECT_URL=postgresql://build:build@localhost:5432/build?schema=public \
    npm ci

COPY . .
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build?schema=public \
    DIRECT_URL=postgresql://build:build@localhost:5432/build?schema=public \
    npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "export DIRECT_URL=\"${DIRECT_URL:-$DATABASE_URL}\" && npm run db:migrate && npm run db:seed && npm run start"]
