FROM node:10
WORKDIR /app
RUN npm i -g nodemon

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./

EXPOSE 4444
CMD [ "npm", "run", "dev" ]