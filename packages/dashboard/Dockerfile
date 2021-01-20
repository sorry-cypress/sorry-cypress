FROM node:12-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1-alpine
WORKDIR /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY /server/static .
COPY --from=build /app/dist .
COPY --from=build /app/dist/views/index.ejs index.html
ENV GRAPHQL_SCHEMA_URL "http://localhost:4000"
ENV CI_URL ""
ENV GRAPHQL_CLIENT_CREDENTIALS ""