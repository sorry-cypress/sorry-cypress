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
import {
  ArrayItemType,
  getRunTestsProgress,
  isRunCompleted,
} from '@sorry-cypress/common';
import {
  Chip,
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
import {
  useBackgroundColorOnProjectListItem,
  useShowTestsAreRunningOnProjectListItem,
} from '@sorry-cypress/dashboard/hooks';
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
  const [
    shouldShowTestsAreRunningOnProjectListItem,
  ] = useShowTestsAreRunningOnProjectListItem();
  // We get the last run
  const lastRun = runsFeed?.runs[0];
  if (lastRun === undefined) return null;
  const groups = lastRun?.progress?.groups;
  if (!groups) return null;
  // We show only run finished
  if (!shouldShowTestsAreRunningOnProjectListItem)
    if (!isRunCompleted(lastRun?.progress as RunProgress)) return null;
  return getRunTestsProgress(lastRun?.progress as RunProgress);
}

/**
 * Method to show a little Chip component that tests are actually running if activated.
 * @param project the wanted project.
 * @return the Chip if true. Otherwise, null.
 */
export function showTestsAreRunning(project: any) {
  const [
    shouldShowTestsAreRunningOnProjectListItem,
  ] = useShowTestsAreRunningOnProjectListItem();
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
  if (
    !isRunCompleted(lastRun?.progress as RunProgress) &&
    shouldShowTestsAreRunningOnProjectListItem
  ) {
    return <Chip label="Tests are running" color="cyan" />;
  } else {
    return null;
  }
}

/**
 * We add border only if we use background color properties.
 * So we return only 1 if it's used, otherwise we return null.
 */
function useBorder() {
  const [
    shouldUseBackgroundColorOnProjectListItem,
  ] = useBackgroundColorOnProjectListItem();
  if (!shouldUseBackgroundColorOnProjectListItem) return null;
  else return 1;
}

/**
 * Get color for the project component regarding the status of the test execution.
 * @param project the wanted project.
 * @param isBackgroundColor if it's the background color or the border color wanted to use.
 * @return the wanted value (4 cases : empty project, failing project, flaky project, successful project)
 */
function useColorRegardingTestStatus(
  project: ArrayItemType<
    Array<{
      __typename?: 'Project';
      projectId: string;
      projectColor: string | null;
    }>
  >,
  isBackgroundColor: boolean
) {
  const [
    shouldUseBackgroundColorOnProjectListItem,
  ] = useBackgroundColorOnProjectListItem();
  if (!shouldUseBackgroundColorOnProjectListItem) return null;
  const tests = useGetTestsFromProject(project);
  // No test executed (empty project)
  if (
    (tests?.overall === undefined || tests?.overall === 0) &&
    isBackgroundColor
  )
    return '#dcf1fa';
  if (
    (tests?.overall === undefined || tests?.overall === 0) &&
    !isBackgroundColor
  )
    return '#0aabf0';
  // At least 1 test failed
  else if (tests?.failures && isBackgroundColor) return '#fae8ea';
  if (tests?.failures && !isBackgroundColor) return '#f01616';
  // No fail but at least 1 test flaky
  else if (tests?.flaky && isBackgroundColor) return '#f1e3fa';
  if (tests?.flaky && !isBackgroundColor) return '#9e16f0';
  // All tests worked
  else if (isBackgroundColor) return '#e3f5e1';
  if (!isBackgroundColor) return '#1a913a';
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
              backgroundColor: useColorRegardingTestStatus(project, true),
              border: useBorder(),
              borderRadius: useBorder(),
              borderColor: useColorRegardingTestStatus(project, false),
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
              {showTestsAreRunning(project)}
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
