# API de BiblioHuila en tres etapas:
#   deps  -> instala SOLO las dependencias de producción, exactas al lockfile (npm ci)
#   test  -> corre las pruebas: `docker build --target test api` (si fallan, el build falla)
#   prod  -> lo que se despliega: sin pruebas, usuario sin privilegios, health check
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM deps AS test
COPY src ./src
COPY test ./test
RUN npm test

FROM node:22-alpine AS prod
WORKDIR /app
# La versión la pone el pipeline (--build-arg APP_VERSION=<commit>); en la laptop queda "dev".
ARG APP_VERSION=dev
ENV NODE_ENV=production \
    PORT=3000 \
    RUTA_DB=/data/biblio.db \
    APP_VERSION=${APP_VERSION}
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
RUN mkdir -p /data && chown node:node /data
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null || exit 1
CMD ["node", "src/server.js"]
