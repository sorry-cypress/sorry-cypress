import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { environment } from '../state/environment';
import { navStructure } from './navigation';
import { API_CLIENT_CREDENTIALS } from '@src/config';

const cache = new InMemoryCache({
  typePolicies: {
    Run: {
      keyFields: ['runId'],
    },
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
  credentials: API_CLIENT_CREDENTIALS,
});

client.onResetStore(async () => navStructure([]));
