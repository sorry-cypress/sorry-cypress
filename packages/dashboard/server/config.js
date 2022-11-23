require('dotenv').config();

exports.PORT = process.env.PORT || 8080;
exports.GRAPHQL_SCHEMA_URL =
  process.env.GRAPHQL_SCHEMA_URL || 'http://localhost:4000';
exports.GRAPHQL_CLIENT_CREDENTIALS =
  process.env.GRAPHQL_CLIENT_CREDENTIALS || '';
exports.CI_URL = process.env.CI_URL || '';
