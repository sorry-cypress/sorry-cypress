import { Avatar, Box, Container, Typography } from '@mui/material';
import { setNav } from '@sorry-cypress/dashboard/lib/navigation';
import logoDark from '@sorry-cypress/dashboard/resources/logo-dark.svg';
import React, { FunctionComponent, useLayoutEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

export const DashboardView: DashboardComponent = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') === 'false' ? false : true;

  useLayoutEffect(() => {
    setNav([]);
  }, []);

  return (
    <>
      <Container sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography
            component="h1"
            variant="h6"
            color="text.primary"
            sx={{ mb: 5 }}
          >
            Welcome to Sorry-Cypress!
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar
            alt="Sorry Cypress Dashboard Home"
            src={logoDark}
            variant="square"
            sx={{
              width: '100%',
              height: '100%',
              maxWidth: 500,
            }}
          />
        </Box>
      </Container>

      {redirect && <Navigate to="/projects" />}
    </>
  );
};

type DashboardProps = {
  // empty
};
type DashboardComponent = FunctionComponent<DashboardProps>;
