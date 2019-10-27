require('dotenv').config();

exports.PORT = process.env.PORT || 8080;

exports.GRAPHQL_SCHEMA_URL =
  process.env.GRAPHQL_SCHEMA_URL || 'http://localhost:4000';
