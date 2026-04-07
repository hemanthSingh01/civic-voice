FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY server/package*.json ./
RUN npm ci

COPY server/prisma ./prisma
RUN npx prisma generate

COPY server/src ./src
COPY server/scripts ./scripts
COPY server/setup-admin.js ./setup-admin.js
COPY server/setup-owner.js ./setup-owner.js

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
