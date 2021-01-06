FROM node:12-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
RUN npm ci
COPY . .
RUN npm run build

FROM node:12-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --from=build /app/dist dist
EXPOSE 1234
CMD ["node", "dist"]
