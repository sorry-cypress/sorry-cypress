import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadTypedefsSync } from '@graphql-tools/load';
import path from 'path';

const sources = loadTypedefsSync(path.resolve(__dirname, './schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});
export const typeDefs = sources.map((source) => source.document);
