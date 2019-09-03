import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { client } from './lib/apolloClient';

import { RunsList } from './RunsList';
export const Root = () => {
  return (
    <ApolloProvider client={client}>
      Hello world!
      <RunsList />
    </ApolloProvider>
  );
};
