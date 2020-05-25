FROM node:11.5.0
WORKDIR /app

COPY package*.json ./


RUN npm cache clean --force
RUN npm cache verify

RUN npm install

COPY tsconfig.json ./
COPY webpack.config.js ./
COPY .babelrc ./
COPY server ./server
COPY src ./src

RUN npm run build

EXPOSE 8080
CMD [ "npm", "run", "start" ]
