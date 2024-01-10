ARG VARIANT="bullseye"
FROM mcr.microsoft.com/devcontainers/base:${VARIANT}

# Install Node
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
  apt-get update && \
  apt-get install -y nodejs && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

RUN npm install -g corepack
