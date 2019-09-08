FROM node:10
WORKDIR /app

RUN npm i -g npm-run-all

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY webpack.config.js ./
COPY .babelrc ./

EXPOSE 8080
CMD [ "npm", "run", "dev" ]