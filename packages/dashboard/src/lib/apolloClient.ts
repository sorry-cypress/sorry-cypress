import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { environment } from '../state/environment';
import { navStructure } from './navigation';

const omitTypename = (key: string, value: unknown) =>
  key === '__typename' ? undefined : value;

const cleanTypename = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      omitTypename
    );
  }
  return forward(operation).map((data) => data);
});
const cache = new InMemoryCache({
  typePolicies: {
    Run: {
      keyFields: ['runId'],
    },
    Instance: {
      keyFields: ['instanceId'],
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

const link = ApolloLink.from([
  cleanTypename,
  createHttpLink({
    uri: environment.GRAPHQL_SCHEMA_URL,
    credentials: environment.GRAPHQL_CLIENT_CREDENTIALS || undefined,
  }),
]);

export const client = new ApolloClient({
  cache,
  link,
  resolvers: {},
});

client.onResetStore(async () => navStructure([]));
