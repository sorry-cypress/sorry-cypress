FROM node:10
WORKDIR /app

COPY package*.json  ./
RUN npm install

COPY src ./src
COPY config ./config
COPY .babelrc ./
COPY tsconfig.json ./

RUN npm run build

EXPOSE 1234
CMD [ "npm", "run", "start" ]