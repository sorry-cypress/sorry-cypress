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
import { ArrayItemType } from '@sorry-cypress/common/ts';
import {
  TestFailureChip,
  TestFlakyChip,
  TestOverallChip,
  TestPendingChip,
  TestSkippedChip,
  TestSuccessChip,
} from '@sorry-cypress/dashboard/components';
import { GetProjectsQuery } from '@sorry-cypress/dashboard/generated/graphql';
import { useGetRunsFeed } from '@sorry-cypress/dashboard/run/runsFeed/useGetRunFeed';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

type ProjectListItemProps = {
  project: ArrayItemType<GetProjectsQuery['projects']>;
  reloadProjects: () => void;
};

/**
 * Get tests information data from a given project.
 * @param project the wanted project.
 * @return the dataset of all tests status.
 */
export function useGetTestsFromProject(project: any) {
  const projectId = project.projectId;
  const search = '';
  const [runsFeed] = useGetRunsFeed({
    projectId,
    search,
  });
  // We get the last run
  const lastRun = runsFeed?.runs[0];
  if (lastRun === undefined) return null;
  const progress = lastRun?.progress;
  const groups = progress?.groups;
  let tests;
  if (groups !== undefined && groups.length > 0) tests = groups[0].tests;
  return tests;
}

/**
 * Get background color for the project component regarding the status of the test execution.
 * @param project the wanted project.
 * @return the wanted value (4 cases : empty project, failing project, flaky project, successful project)
 */
function useGetBackgroundColorRegardingTestStatus(
  project: ArrayItemType<
    Array<{
      __typename?: 'Project';
      projectId: string;
      projectColor: string | null;
    }>
  >
) {
  const tests = useGetTestsFromProject(project);
  // No test executed (empty project)
  if (tests?.overall === undefined || tests?.overall === 0) return '#E7FFFD';
  // At least 1 test failed
  else if (tests?.failures) return '#FFC0C8';
  // No fail but at least 1 test flaky
  else if (tests?.flaky) return '#FADAF0';
  // All tests worked
  else return '#E0FEE7';
}

export function ProjectListItem({ project }: ProjectListItemProps) {
  // To fix a bug about project created directly from an execution instead of the dashboard
  let defaultProjectNameColor;
  if (project.projectColor === '') defaultProjectNameColor = '#3486E3';
  else defaultProjectNameColor = project.projectColor ?? '#3486E3';
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
          <CardContent
            sx={{
              backgroundColor: useGetBackgroundColorRegardingTestStatus(
                project
              ),
            }}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    backgroundColor: alpha(defaultProjectNameColor, 0.1),
                  }}
                >
                  <Book sx={{ color: defaultProjectNameColor }} />
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

// New component to show the latest run data for a project
const LastTestRunData: React.FC<{ project: any }> = ({ project }) => {
  if (project === undefined) {
    return null;
  } else {
    const tests = useGetTestsFromProject(project);
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
