FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
RUN npm install -g pnpm
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# Production image, copy all the files and run compiled app
FROM alpine AS runner
RUN apk add --update nodejs

WORKDIR /app

# package.json needed for `type: "module"` to run awaits at top-level and imports
COPY package.json ./
COPY --from=builder /app/dist/app.js ./
COPY --from=builder /app/dist/migrations ./migrations

ENV PORT 80

EXPOSE 80

CMD ["node", "app.js"]
