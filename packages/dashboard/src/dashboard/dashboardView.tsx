import { Box, Link, Typography } from '@mui/material';
import { setNav } from '@sorry-cypress/dashboard/lib/navigation';
import React, { FunctionComponent, useLayoutEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import packageJson from '../../../../package.json';

export const DashboardView: DashboardComponent = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') === 'false' ? false : true;

  useLayoutEffect(() => {
    setNav([]);
  }, []);

  return (
    <>
      <Box textAlign="center">
        <Typography
          component="h1"
          variant="h5"
          color="text.primary"
          sx={{ mb: 5 }}
        >
          Welcome to Sorry-Cypress! Please choose a project from the sidebar to
          get started.
        </Typography>

        <Box textAlign="center" my={3}>
          <img src="./og-card.png" alt="Sorry Cypress" height="360px" />
        </Box>

        <Box display={'flex'} flexDirection={'column'}>
          <Link
            href={`https://github.com/sorry-cypress/sorry-cypress/releases/tag/v${packageJson.version}`}
          >
            v{packageJson.version}
          </Link>

          <Link href="https://github.com/sorry-cypress/sorry-cypress/">
            GitHub
          </Link>

          <Link href="https://sorry-cypress.dev">Documentation</Link>
        </Box>
      </Box>

      {redirect && <Navigate to="/projects" />}
    </>
  );
};

type DashboardProps = {
  // empty
};
type DashboardComponent = FunctionComponent<DashboardProps>;
