FROM node:22-alpine

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "export DATABASE_URL=\"${DATABASE_URL:-$DIRECT_URL}\" && export DIRECT_URL=\"${DIRECT_URL:-$DATABASE_URL}\" && npm run db:migrate && npm run db:seed && npm run start"]
