import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'bold-ui';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Content } from './components/layout/content';
import { Footer } from './components/layout/footer';
import { Header } from './components/layout/header';
import { Layout } from './components/layout/layout';
import { client } from './lib/apolloClient';
import { theme } from './theme/theme';
import { InstanceDetailsView } from './views/InstanceDetailsView';
import { ProjectEditView } from './views/ProjectEditView';
import { ProjectsView } from './views/ProjectsView';
import { RunDetailsView } from './views/RunDetailsView';
import { RunsView } from './views/RunsView';
import { TestDetailsView } from './views/TestDetailsView';

class ErrorBoundary extends React.Component<
  unknown,
  {
    hasError: boolean;
    error: Error | null;
  }
> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1rem' }}>
          {this.state.error && <pre>{this.state.error.stack}</pre>}
          <p>
            Please report at{' '}
            <a
              href="https://github.com/agoldis/sorry-cypress/issues/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github Issues
            </a>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
export const Root = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Router>
          <ErrorBoundary>
            <Layout>
              <Header />
              <Content>
                <Route path="/" exact component={ProjectsView} />

                <Route path="/:projectId/runs" component={RunsView} />
                <Route path="/:projectId/edit" component={ProjectEditView} />
                <Route path="/run/:id" component={RunDetailsView} />
                <Route
                  path="/instance/:id"
                  component={InstanceDetailsView}
                  exact
                />
                <Route
                  path="/instance/:instanceId/test/:testId"
                  component={TestDetailsView}
                />
              </Content>
              <Footer />
            </Layout>
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
};
