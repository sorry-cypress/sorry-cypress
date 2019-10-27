require('dotenv').config();

exports.GRAPHQL_SCHEMA_URL =
  process.env.GRAPHQL_SCHEMA_URL || 'http://localhost:4000';
