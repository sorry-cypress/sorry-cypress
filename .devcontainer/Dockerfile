ARG VARIANT="3.17"
FROM mcr.microsoft.com/devcontainers/base:alpine-${VARIANT}

RUN apk update \
  && apk add --no-cache nodejs npm

RUN npm install -g corepack
