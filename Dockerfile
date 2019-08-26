FROM node:10
WORKDIR /app
RUN npm i -g nodemon
COPY package*.json ./
RUN npm install

EXPOSE 1234
CMD [ "nodemon", "--experimental-modules", "./src/" ]