import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { environment } from '../state/environment';
import { navStructure } from './navigation';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        navStructure: {
          read() {
            return navStructure();
          },
        },
      },
    },
  },
});

const link = createHttpLink({
  uri: environment.GRAPHQL_SCHEMA_URL,
});

export const client = new ApolloClient({
  cache,
  link,
  resolvers: {},
});

client.onResetStore(async () => navStructure([]));
