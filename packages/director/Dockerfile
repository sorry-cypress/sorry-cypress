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

FROM amazon/aws-lambda-nodejs:16
COPY --chown=node:node --from=build /app/packages/director/dist/index.js index.js
ENV NODE_ENV=production
CMD ["index.handler"]
