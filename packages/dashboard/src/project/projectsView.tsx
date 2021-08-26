import { Button, Container, Grid } from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import { SearchField } from '@sorry-cypress/dashboard/components';
import { setNav } from '@sorry-cypress/dashboard/lib/navigation';
import ProjectsList from '@sorry-cypress/dashboard/project/projectList';
import React, { useLayoutEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { WithMaterial } from '../lib/material';

export function ProjectsView() {
  const [search, setSearch] = useState('');
  const history = useHistory();
  useLayoutEffect(() => {
    setNav([]);
  }, []);

  return (
    <WithMaterial>
      <Container>
        <Grid
          container
          spacing={3}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {/* <Box marginRight="auto"> */}
          <Grid item xs={10}>
            <SearchField
              placeholder="Enter project id"
              onSearch={(value) => setSearch(value)}
            />
          </Grid>
          {/* </Box> */}
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
      </Container>
    </WithMaterial>
  );
}
