import React from 'react';

import { ApolloProvider } from '@apollo/react-hooks';
import { client } from './lib/apolloClient';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import { RunsView } from './views/RunsView';
import { RunDetailsView } from './views/RunDetailsView';
import { InstanceDetailsView } from './views/InstanceDetailsView';

export const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
        <Route path="/" exact component={RunsView} />
        <Route path="/run/:id" component={RunDetailsView} />
        <Route path="/instance/:id" component={InstanceDetailsView} />
      </Router>
    </ApolloProvider>
  );
};
