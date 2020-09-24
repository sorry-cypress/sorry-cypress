require('dotenv').config();

exports.PORT = process.env.PORT || 8080;

exports.GRAPHQL_SCHEMA_URL =
  process.env.GRAPHQL_SCHEMA_URL || 'http://localhost:4000';

exports.BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : '';
