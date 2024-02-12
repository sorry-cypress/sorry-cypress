ARG BUILD_PLATFORM=linux/amd64
FROM --platform="${BUILD_PLATFORM}" node:16-alpine AS build
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

COPY packages/api/ ./packages/api
COPY packages/common/ ./packages/common
COPY packages/mongo/ ./packages/mongo
COPY packages/logger/ ./packages/logger
COPY tsconfig.json ./
RUN yarn install --frozen-lockfile
RUN yarn workspace @sorry-cypress/common build
RUN yarn workspace @sorry-cypress/mongo build
RUN yarn workspace @sorry-cypress/logger build
RUN yarn workspace @sorry-cypress/api build
RUN apk --no-cache add curl && \
    curl -sf https://gobinaries.com/tj/node-prune | sh && \
    node-prune
RUN yarn install --production --frozen-lockfile

FROM node:16-alpine
ARG USER=node
WORKDIR /app
COPY  --chown=node:node --from=build /app/packages/ packages/
COPY  --chown=node:node --from=build /app/node_modules/ node_modules/
RUN apk add --no-cache tini
COPY aws/global-bundle.pem ./
ENV NODE_ENV=production
USER ${USER}
EXPOSE 4000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "packages/api/dist"]
