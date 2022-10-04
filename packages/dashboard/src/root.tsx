import { ApolloProvider } from '@apollo/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { CiBuildsView } from '@sorry-cypress/dashboard/ciBuild/ciBuildsView';
import { ProjectsView } from '@sorry-cypress/dashboard/project/projectsView';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from './components';
import { DashboardView } from './dashboard/dashboardView';
import { InstanceDetailsView } from './instance/instanceDetailsView';
import { client } from './lib/apolloClient';
import { ProjectEditView } from './project/projectEditView';
import { RunDetailsView } from './run/runDetails/runDetailsView';
import { RunRedirect } from './run/runsRedirect';
import { RunsView } from './run/runsView';
import { theme } from './theme';

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
        <CssBaseline />
        <Router>
          <ErrorBoundary>
            <Layout>
              <Routes>
                <Route path="/" element={<DashboardView />} />
                <Route path="/projects" element={<ProjectsView />} />
                <Route
                  path="/:projectId/runs/:buildId"
                  element={<RunRedirect />}
                />
                <Route path="/:projectId/runs" element={<RunsView />} />
                <Route path="/:projectId/edit" element={<ProjectEditView />} />
                <Route path="/run/:id" element={<RunDetailsView />} />
                <Route
                  path={'/instance/:id'}
                  element={<InstanceDetailsView />}
                />
                <Route
                  path={'/instance/:id/test/:testId'}
                  element={<InstanceDetailsView />}
                />
                <Route
                  path={'/instance/:id/others/:itemId'}
                  element={<InstanceDetailsView />}
                />
                <Route path={'/ci-builds'} element={<CiBuildsView />} />
              </Routes>
            </Layout>
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
};
