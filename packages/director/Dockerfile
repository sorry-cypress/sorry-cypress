FROM node:16-alpine AS build
WORKDIR /app
COPY packages/director/ ./packages/director/
COPY packages/common/ ./packages/common
COPY packages/mongo/ ./packages/mongo
COPY packages/logger/ ./packages/logger
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
RUN yarn install --frozen-lockfile

RUN yarn workspace @sorry-cypress/common build
RUN yarn workspace @sorry-cypress/mongo build
RUN yarn workspace @sorry-cypress/logger build
RUN yarn workspace @sorry-cypress/director build

RUN yarn install --production --frozen-lockfile
RUN apk --no-cache add curl && \
    curl -sf https://gobinaries.com/tj/node-prune | sh && \
    node-prune

FROM node:16-alpine
ARG USER=node
WORKDIR /app
COPY --chown=node:node --from=build /app/packages/ packages/
COPY --chown=node:node --from=build /app/node_modules/ node_modules/
RUN apk add --no-cache tini
ENV NODE_ENV=production
USER ${USER}
EXPOSE 1234
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["./node_modules/.bin/pm2-runtime", "packages/director/dist"]
