FROM node:10
WORKDIR /app
RUN npm i -g nodemon

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY ./.aws /root/.aws

EXPOSE 1234
CMD [ "npm", "run", "dev" ]