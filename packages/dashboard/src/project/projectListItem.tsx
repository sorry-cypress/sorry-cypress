import { Book } from '@mui/icons-material';
import {
  alpha,
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from '@mui/material';
import { isTestFlaky } from '@sorry-cypress/common';
import { ArrayItemType } from '@sorry-cypress/common/ts';
import {
  TestFailureChip,
  TestFlakyChip,
  TestOverallChip,
  TestPendingChip,
  TestSkippedChip,
  TestSuccessChip,
} from '@sorry-cypress/dashboard/components';
import {
  GetProjectsQuery,
  useGetInstanceQuery,
} from '@sorry-cypress/dashboard/generated/graphql';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

type ProjectListItemProps = {
  project: ArrayItemType<GetProjectsQuery['projects']>;
  reloadProjects: () => void;
};

export function ProjectListItem({ project }: ProjectListItemProps) {
  return (
    <Link
      component={RouterLink}
      to={`/${encodeURIComponent(project.projectId)}/runs`}
      underline="none"
    >
      <Card
        variant="outlined"
        sx={{
          display: 'block',
        }}
      >
        <CardActionArea>
          <CardContent>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    backgroundColor: alpha(
                      project.projectColor ?? '#3486E3',
                      0.1
                    ),
                  }}
                >
                  <Book sx={{ color: project.projectColor ?? '#3486E3' }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={decodeURIComponent(project.projectId)}
                primaryTypographyProps={{
                  variant: 'body1',
                  style: { wordBreak: 'break-word' },
                }}
              />
            </ListItem>
            <InstanceData projectId={project.projectId} />
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

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

  const stats = data.instance?.results?.stats;
  const flaky = data.instance?.results?.tests?.filter(isTestFlaky).length ?? 0;

  return (
    <Grid container>
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
