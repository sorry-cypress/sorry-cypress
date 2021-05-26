FROM node:14-alpine AS build
WORKDIR /app
COPY packages/director/ ./packages/director/
COPY packages/common/ ./packages/common
COPY packages/mongo/ ./packages/mongo
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

RUN yarn workspace @sorry-cypress/common build
RUN yarn workspace @sorry-cypress/mongo build
RUN yarn workspace @sorry-cypress/director build

FROM node:14-alpine
WORKDIR /app
COPY --from=build /app/packages/common/dist packages/common/dist
COPY --from=build /app/packages/mongo/dist packages/mongo/dist
COPY --from=build /app/packages/director/dist packages/director/dist
COPY packages/director/package.json /app/packages/director/package.json
COPY packages/common/package.json /app/packages/common/package.json
COPY packages/mongo/package.json /app/packages/mongo/package.json
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production --frozen-lockfile
EXPOSE 1234
CMD ["node", "packages/director/dist"]
