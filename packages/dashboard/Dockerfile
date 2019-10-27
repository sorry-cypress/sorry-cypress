FROM node:10
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY webpack.config.js ./
COPY .babelrc ./
COPY server ./server
COPY src ./src

RUN npm run build

EXPOSE 8080
CMD [ "npm", "run", "start" ]