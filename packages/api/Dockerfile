FROM node:10
WORKDIR /app
RUN npm i -g nodemon

COPY package*.json ./
RUN npm install

COPY .env ./
COPY tsconfig.json ./

EXPOSE 4000
CMD [ "npm", "run", "dev" ]