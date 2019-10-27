import { gql } from 'apollo-server';
import { importSchema } from 'graphql-import';
import path from 'path';

export const typeDefs = gql(
  importSchema(path.resolve(__dirname, './schema.graphql'))
);
