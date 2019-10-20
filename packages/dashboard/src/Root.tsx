import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from 'bold-ui';

import { client } from './lib/apolloClient';
import { theme } from './theme/theme';

import { Header } from './components/layout/header';
import { Content } from './components/layout/content';

import { RunsView } from './views/RunsView';
import { RunDetailsView } from './views/RunDetailsView';
import { InstanceDetailsView } from './views/InstanceDetailsView';

export const Root = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Router>
          <Header />
          <Content>
            <Route path="/" exact component={RunsView} />
            <Route path="/run/:id" component={RunDetailsView} />
            <Route path="/instance/:id" component={InstanceDetailsView} />
          </Content>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
};
