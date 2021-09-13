import { Button, Grid } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { SearchField } from '@sorry-cypress/dashboard/components';
import { WithMaterial } from '@sorry-cypress/dashboard/lib/material';
import { setNav } from '@sorry-cypress/dashboard/lib/navigation';
import ProjectsList from '@sorry-cypress/dashboard/project/projectList';
import React, { useLayoutEffect, useState } from 'react';
import { useHistory } from 'react-router';

export function DashboardView() {
  const [search, setSearch] = useState('');
  const history = useHistory();
  useLayoutEffect(() => {
    setNav([]);
  }, []);

  return (
    <WithMaterial>
      <Grid
        container
        spacing={3}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={10}>
          <SearchField
            placeholder="Enter project id"
            onSearch={(value) => setSearch(value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            disableElevation
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              history.push('/--create-new-project--/edit');
            }}
            startIcon={<Add />}
          >
            New Project
          </Button>
        </Grid>
      </Grid>
      <ProjectsList search={search} />
    </WithMaterial>
  );
}
