FROM node:12-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1-alpine
ENV NGINX_ENVSUBST_TEMPLATE_DIR=/usr/share/nginx/html
ENV NGINX_ENVSUBST_OUTPUT_DIR=/usr/share/nginx/html
WORKDIR /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY /server/static .
COPY --from=build /app/dist .
RUN sed 's/<?- SORRY_CYPRESS_ENVIRONMENT ?>/{"GRAPHQL_SCHEMA_URL":"$GRAPHQL_SCHEMA_URL","CI_URL":"$CI_URL"}/' views/index.ejs > index.html.template
