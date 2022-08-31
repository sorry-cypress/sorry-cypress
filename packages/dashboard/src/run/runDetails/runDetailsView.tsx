import {
  Loop as LoopIcon,
  MenuBook as MenuBookIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { Alert, Grid, Skeleton, Typography } from '@mui/material';
import { Toolbar } from '@sorry-cypress/dashboard/components';
import {
  GetRunQuery,
  useGetRunQuery,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useHideSuccessfulSpecs } from '@sorry-cypress/dashboard/hooks';
import {
  useAutoRefresh,
  useAutoRefreshRate,
} from '@sorry-cypress/dashboard/hooks/useAutoRefresh';
import {
  ReadableSpecNamesKind,
  useReadableSpecNames,
} from '@sorry-cypress/dashboard/hooks/useReadableSpecNames';
import {
  getProjectPath,
  getRunPath,
  NavItemType,
  setNav,
} from '@sorry-cypress/dashboard/lib/navigation';
import { RunSummary } from '@sorry-cypress/dashboard/run/runSummary/runSummary';
import React, { FunctionComponent, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RunDetails } from './runDetails';

export const RunDetailsView: RunDetailsViewComponent = () => {
  const { id } = useParams();
  const autoRefreshRate = useAutoRefreshRate();
  const [hidePassedSpecs, setHidePassedSpecs] = useHideSuccessfulSpecs();
  const [
    readableSpecNames,
    { switchReadableSpecNames },
  ] = useReadableSpecNames();
  const [shouldAutoRefresh, setShouldAutoRefresh] = useAutoRefresh();

  const { loading, error, data } = useGetRunQuery({
    variables: { runId: id! },
    pollInterval: autoRefreshRate,
  });

  updateNav(data);

  if (loading)
    return (
      <>
        <Grid container justifyContent="right" spacing={1}>
          <Grid item>
            <Skeleton
              variant="rectangular"
              height={37}
              width={100}
              sx={{ mb: 2 }}
              animation="wave"
            />
          </Grid>
          <Grid item>
            <Skeleton
              variant="rectangular"
              height={37}
              width={100}
              sx={{ mb: 2 }}
              animation="wave"
            />
          </Grid>
        </Grid>
        <Skeleton variant="rectangular" height={240} animation="wave" />
        <Skeleton
          variant="text"
          height={32}
          width={100}
          sx={{ my: 5 }}
          animation="wave"
        />
        <Skeleton variant="rectangular" height={400} animation="wave" />
      </>
    );

  if (error)
    return (
      <Alert severity="error" variant="filled">
        {error.toString()}
      </Alert>
    );

  if (!data)
    return (
      <Alert severity="info" variant="filled">
        No data
      </Alert>
    );

  if (!data.run) {
    return (
      <Alert severity="error" variant="filled">
        Non-existing run
      </Alert>
    );
  }

  return (
    <>
      <Toolbar
        actions={[
          {
            key: 'hidePassedSpecs',
            text: 'Hide Successful Specs',
            icon: VisibilityOffIcon,
            selected: hidePassedSpecs,
            toggleButton: true,
            onClick: () => {
              setHidePassedSpecs(!hidePassedSpecs);
            },
          },
          {
            key: 'autoRefresh',
            text: 'Auto Refresh',
            icon: LoopIcon,
            toggleButton: true,
            selected: !!shouldAutoRefresh,
            onClick: () => {
              setShouldAutoRefresh(!shouldAutoRefresh);
              window.location.reload();
            },
          },
          {
            key: 'readableSpecNames',
            text: 'Readable Spec Names',
            icon: MenuBookIcon,
            showInMenuBreakpoint: ['xs'],
            selected: readableSpecNames === ReadableSpecNamesKind.ReadableName,
            toggleButton: true,
            onClick: () => {
              switchReadableSpecNames();
            },
          },
        ]}
      />
      <RunSummary run={data.run} />
      <Typography
        component="h1"
        variant="h6"
        color="text.primary"
        sx={{ mt: 5, mb: 2 }}
      >
        Spec Files
      </Typography>
      <RunDetails
        key={readableSpecNames}
        run={data.run}
        hidePassedSpecs={hidePassedSpecs}
        readableSpecNames={readableSpecNames}
      />
    </>
  );
};

const updateNav = (data?: GetRunQuery) =>
  useLayoutEffect(() => {
    if (!data?.run) {
      setNav([]);
      return;
    }

    setNav([
      {
        type: NavItemType.projects,
        label: 'Projects',
        link: './projects',
      },

      {
        type: NavItemType.project,
        label: data.run.meta.projectId,
        link: getProjectPath(data.run.meta.projectId),
      },
      {
        type: NavItemType.latestRuns,
        label: 'Runs',
        link: getProjectPath(data.run.meta.projectId),
      },
      {
        type: NavItemType.run,
        label: data.run.meta.ciBuildId,
        link: getRunPath(data.run.runId),
      },
    ]);
  }, [data]);

type RunDetailsViewProps = {
  // nothing yet
};
type RunDetailsViewComponent = FunctionComponent<RunDetailsViewProps>;
