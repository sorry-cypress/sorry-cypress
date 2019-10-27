FROM node:10
WORKDIR /app


COPY package*.json ./
RUN npm install

COPY .babelrc ./
COPY ts-dev.js ./
COPY codegen.yml ./
COPY tsconfig.json ./

COPY src ./src

RUN npm run build

EXPOSE 4000
CMD [ "npm", "run", "start" ]