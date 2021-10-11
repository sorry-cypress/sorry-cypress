import { VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { Alert, Grid, Skeleton, Typography } from '@mui/material';
import { Toolbar } from '@sorry-cypress/dashboard/components';
import {
  GetRunQuery,
  useGetRunQuery,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useHideSuccessfulSpecs } from '@sorry-cypress/dashboard/hooks';
import { useAutoRefreshRate } from '@sorry-cypress/dashboard/hooks/useAutoRefresh';
import { WithMaterial } from '@sorry-cypress/dashboard/lib/material';
import {
  getProjectPath,
  getRunPath,
  NavItemType,
  setNav,
} from '@sorry-cypress/dashboard/lib/navigation';
import { RunSummary } from '@sorry-cypress/dashboard/run/runSummary/runSummary';
import React, { FunctionComponent, useLayoutEffect } from 'react';
import { RunDetails } from './details';

export const RunDetailsView: RunDetailsViewComponent = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;

  const autoRefreshRate = useAutoRefreshRate();
  const [hidePassedSpecs, setHidePassedSpecs] = useHideSuccessfulSpecs();

  const { loading, error, data } = useGetRunQuery({
    variables: { runId: id },
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
    <WithMaterial>
      <Toolbar
        actions={[
          {
            key: 'hidePassedSpecs',
            text: 'Hide Successful Specs',
            primary: hidePassedSpecs,
            icon: VisibilityOffIcon,
            selected: hidePassedSpecs,
            toggleButton: true,
            onClick: () => {
              setHidePassedSpecs(!hidePassedSpecs);
            },
          },
        ]}
      />
      <RunSummary run={data.run} />
      <Typography
        component="h1"
        variant="h6"
        color="text.primary"
        sx={{ my: 5 }}
      >
        Spec Files
      </Typography>
      <RunDetails run={data.run} hidePassedSpecs={hidePassedSpecs} />
    </WithMaterial>
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
  match: {
    params: {
      id: string;
    };
  };
};
type RunDetailsViewComponent = FunctionComponent<RunDetailsViewProps>;
