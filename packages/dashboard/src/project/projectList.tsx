import { Fade, Grid, Skeleton } from '@mui/material';
import { Paper } from '@sorry-cypress/dashboard/components';
import {
  Filters,
  useGetProjectsQuery,
} from '@sorry-cypress/dashboard/generated/graphql';
import { ProjectListItem } from '@sorry-cypress/dashboard/project/projectListItem';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import NoProjects from './noProjects';

type ProjectsListProps = {
  search: string;
};

const ProjectsList = ({ search }: ProjectsListProps) => {
  const filters: Filters[] = search
    ? [
        {
          value: (undefined as unknown) as null,
          key: 'projectId',
          like: search,
        },
      ]
    : [];
  const { loading, error, data, refetch } = useGetProjectsQuery({
    variables: {
      orderDirection: null,
      filters,
    },
  });

  if (loading) {
    return (
      <Grid
        container
        rowSpacing={2}
        columnSpacing={4}
        columns={{ xs: 1, sm: 8, md: 12, lg: 24, xl: 24 }}
      >
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <Grid item key={key} xs={1} sm={4} md={6} lg={8} xl={6}>
            <Skeleton variant="rectangular" height={88} />
          </Grid>
        ))}
      </Grid>
    );
  }
  if (!data || error) {
    return (
      <Paper>{(error && error.toString()) || 'Oops an error occurred'}</Paper>
    );
  }

  const { projects } = data;

  if (projects.length === 0) {
    if (search) {
      return (
        <Paper>
          <p>No projects found </p>
        </Paper>
      );
    }

    return <NoProjects />;
  }

  return (
    <Grid
      component={TransitionGroup}
      container
      rowSpacing={2}
      columnSpacing={4}
      columns={{ xs: 1, sm: 8, md: 12, lg: 24, xl: 24 }}
    >
      {projects.map((project) => (
        <Grid
          component={Fade}
          item
          key={project.projectId}
          xs={1}
          sm={4}
          md={6}
          lg={8}
          xl={6}
          timeout={500}
        >
          <div>
            <ProjectListItem project={project} reloadProjects={refetch} />
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectsList;
