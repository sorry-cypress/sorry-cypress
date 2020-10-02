FROM node:12-alpine3.12
WORKDIR /app


COPY package*.json ./
RUN npm install

COPY .babelrc ./
COPY codegen.yml ./
COPY tsconfig.json ./

COPY src ./src

RUN npm run build

EXPOSE 4000
CMD [ "npm", "run", "start" ]