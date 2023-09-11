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
} from '@mui/material';
import { ArrayItemType, getRunTestsProgress } from '@sorry-cypress/common';
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
  RunProgress,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useGetRunsFeed } from '@sorry-cypress/dashboard/run/runsFeed/useGetRunFeed';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

type ProjectListItemProps = {
  project: ArrayItemType<GetProjectsQuery['projects']>;
  reloadProjects: () => void;
};

export function ProjectListItem({ project }: ProjectListItemProps) {
  // To fix a bug about project created directly from an execution instead of the dashboard
  let defaultProjectColor;
  if (project.projectColor === '') defaultProjectColor = '#3486E3';
  else defaultProjectColor = project.projectColor ?? '#3486E3';
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
                    backgroundColor: alpha(defaultProjectColor, 0.1),
                  }}
                >
                  <Book sx={{ color: defaultProjectColor }} />
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
            <LastTestRunData project={project} />
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

/**
 * Get tests information data from a given project.
 * @param project the wanted project.
 * @return the dataset of all tests status.
 */
export function getTestsFromProject(project: any) {
  const projectId = project.projectId;
  const search = '';
  const [runsFeed] = useGetRunsFeed({
    projectId,
    search,
  });
  // We get the last run
  const lastRun = runsFeed?.runs[0];
  if (lastRun === undefined) return null;

  const groups = lastRun?.progress?.groups;
  if (!groups) return null;

  return getRunTestsProgress(lastRun?.progress as RunProgress);
}

// New component to show the latest run data for a project
const LastTestRunData: React.FC<{ project: any }> = ({ project }) => {
  if (project === undefined) {
    return null;
  } else {
    const tests = getTestsFromProject(project);
    return (
      <Grid container>
        <Grid item>
          <TestOverallChip value={tests?.overall ?? 0} />
        </Grid>
        <Grid item>
          <TestSuccessChip value={tests?.passes ?? 0} />
        </Grid>
        <Grid item>
          <TestFailureChip value={tests?.failures ?? 0} />
        </Grid>
        <Grid item>
          <TestFlakyChip value={tests?.flaky ?? 0} />
        </Grid>
        <Grid item>
          <TestSkippedChip value={tests?.skipped ?? 0} />
        </Grid>
        <Grid item>
          <TestPendingChip value={tests?.pending ?? 0} />
        </Grid>
      </Grid>
    );
  }
};
