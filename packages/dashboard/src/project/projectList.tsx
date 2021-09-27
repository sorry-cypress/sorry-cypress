import { Fade, Grid } from '@mui/material';
import { CenteredContent } from '@sorry-cypress/dashboard/components';
import {
  Filters,
  useGetProjectsQuery,
} from '@sorry-cypress/dashboard/generated/graphql';
import { ProjectListItem } from '@sorry-cypress/dashboard/project/projectListItem';
import { Heading } from 'bold-ui';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';

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
    return <CenteredContent>Loading ...</CenteredContent>;
  }
  if (!data || error) {
    return (
      <CenteredContent>
        {(error && error.toString()) || 'Oops an error occurred'}
      </CenteredContent>
    );
  }

  const { projects } = data;

  if (projects.length === 0) {
    if (search) {
      return (
        <CenteredContent>
          <p>No projects found </p>
        </CenteredContent>
      );
    }

    return (
      <CenteredContent>
        <Heading level={1}>Welcome to Sorry Cypress!</Heading>
        <p>
          Your projects will appear here.{' '}
          <a
            href="https://github.com/agoldis/sorry-cypress"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </p>
      </CenteredContent>
    );
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
