const express = require('express');
const path = require('path');
const app = (exports.app = express());
const { GRAPHQL_SCHEMA_URL } = require('./config');
const { dev } = require('./dev');

const SORRY_CYPRESS_ENVIRONMENT = JSON.stringify({
  GRAPHQL_SCHEMA_URL
});

app.set('view engine', 'ejs');
app.set('view options', { delimiter: '?' });
app.set('views', path.join(__dirname, '../dist/views'));

app.use(express.static(path.join(__dirname, '../dist')));

if (process.env.NODE_ENV !== 'production') {
  app.use(dev);
}

app.use((_, res) =>
  res.render('index.ejs', {
    SORRY_CYPRESS_ENVIRONMENT
  })
);
