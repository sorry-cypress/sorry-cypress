import { Fade, Grid, Skeleton } from '@mui/material';
import { isTestFlaky } from '@sorry-cypress/common';
import {
  Paper,
  TestFailureChip,
  TestFlakyChip,
  TestOverallChip,
  TestPendingChip,
  TestSkippedChip,
  TestSuccessChip,
} from '@sorry-cypress/dashboard/components';
import {
  Filters,
  useGetInstanceQuery,
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
      <Paper>{(error && String(error)) || 'Oops an error occurred'}</Paper>
    );
  }

  const projects = data?.projects || [];

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

            <InstanceData projectId={project.projectId} />
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectsList;

// New component to fetch instance data for a project
const InstanceData: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { loading, error, data } = useGetInstanceQuery({
    variables: { instanceId: projectId },
  });
  if (loading) {
    return <Skeleton variant="rectangular" height={88} />;
  }
  if (error || !data) {
    return <p>Error fetching instance data</p>;
  }
  // Use the data to render the test chips
  const instanceData = data.instance?.results?.stats;
  if (!instanceData) {
    return null;
  }
  const stats = data.instance?.results?.stats;
  const flaky = data.instance?.results?.tests?.filter(isTestFlaky).length ?? 0;

  return (
    <Grid>
      <Grid item>
        <TestOverallChip value={stats?.tests ?? 0} />
      </Grid>
      <Grid item>
        <TestSuccessChip value={stats?.passes ?? 0} />
      </Grid>
      <Grid item>
        <TestFailureChip value={stats?.failures ?? 0} />
      </Grid>
      <Grid item>
        <TestFlakyChip value={flaky} />
      </Grid>
      <Grid item>
        <TestSkippedChip value={stats?.skipped ?? 0} />
      </Grid>
      <Grid item>
        <TestPendingChip value={stats?.pending ?? 0} />
      </Grid>
    </Grid>
  );
};
