FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
# `npm install` (not `ci`) so a stale lockfile cannot break the build; run `npm install`
# locally once to refresh package-lock.json, then you may switch this to `npm ci`.
RUN npm install --omit=dev --no-audit --no-fund

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p uploads && chown -R node:node /app
USER node
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s \
  CMD wget -qO- http://127.0.0.1:5000/health || exit 1
CMD ["node", "index.js"]
