import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { initialState } from '../state/initialState';

const cache = new InMemoryCache();
cache.writeData({
  data: initialState
});

const link = new HttpLink({
  uri: 'http://0.0.0.0:4000/'
});

export const client = new ApolloClient({
  cache,
  link,
  resolvers: {}
});

client.onResetStore(async () => cache.writeData({ data: initialState }));
