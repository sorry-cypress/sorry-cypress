const express = require('express');
const path = require('path');
const app = (exports.app = express());
const {
  GRAPHQL_CLIENT_CREDENTIALS,
  GRAPHQL_SCHEMA_URL,
  CI_URL,
} = require('./config');

const SORRY_CYPRESS_ENVIRONMENT = JSON.stringify({
  GRAPHQL_CLIENT_CREDENTIALS,
  GRAPHQL_SCHEMA_URL,
  CI_URL,
});

app.set('view engine', 'ejs');
app.set('view options', { delimiter: '?' });
app.set('views', path.join(__dirname, '../dist/views'));

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, './static')));

if (process.env.NODE_ENV !== 'production') {
  const { dev } = require('./dev');
  app.use(dev);
}

app.use((_, res) =>
  res.render('index.ejs', {
    SORRY_CYPRESS_ENVIRONMENT,
  })
);
