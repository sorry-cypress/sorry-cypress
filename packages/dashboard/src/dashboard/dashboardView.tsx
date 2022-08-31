import { Typography } from '@mui/material';
import { setNav } from '@sorry-cypress/dashboard/lib/navigation';
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
      <Typography
        component="h1"
        variant="h6"
        color="text.primary"
        sx={{ mb: 5 }}
      >
        Home
      </Typography>

      <h3>Welcome to Sorry-Cypress!</h3>

      {redirect && <Navigate to="/projects" />}
    </>
  );
};

type DashboardProps = {
  // empty
};
type DashboardComponent = FunctionComponent<DashboardProps>;
