FROM node:14-alpine AS build
WORKDIR /app
COPY packages/api/ ./packages/api
COPY packages/common/ ./packages/common
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
RUN yarn workspace @sorry-cypress/common build
RUN yarn workspace @sorry-cypress/api build

FROM node:14-alpine
WORKDIR /app
COPY --from=build /app/packages/common/dist packages/common/dist
COPY --from=build /app/packages/api/dist packages/api/dist
COPY packages/api/package.json /app/packages/api/package.json
COPY packages/common/package.json /app/packages/common/package.json
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production --frozen-lockfile
EXPOSE 4000
CMD ["node", "packages/api/dist"]