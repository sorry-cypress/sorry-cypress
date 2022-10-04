import { Loop as LoopIcon } from '@mui/icons-material';
import { Alert, AlertTitle, Skeleton } from '@mui/material';
import {
  GetInstanceQuery,
  useGetInstanceQuery,
} from '@sorry-cypress/dashboard/generated/graphql';
import {
  useAutoRefresh,
  useAutoRefreshRate,
} from '@sorry-cypress/dashboard/hooks/useAutoRefresh';
import {
  getInstancePath,
  getProjectPath,
  getRunPath,
  NavItemType,
  setNav,
} from '@sorry-cypress/dashboard/lib/navigation';
import React, { FunctionComponent, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Toolbar } from '../components';
import { InstanceDetails } from './instanceDetails';
import { InstanceSummary } from './instanceSummary';

export const InstanceDetailsView: InstanceDetailsViewComponent = () => {
  const { id, itemId, testId } = useParams();

  const [shouldAutoRefresh, setShouldAutoRefresh] = useAutoRefresh();
  const autoRefreshRate = useAutoRefreshRate();
  const { loading, error, data } = useGetInstanceQuery({
    variables: { instanceId: id! },
    pollInterval: autoRefreshRate,
  });
  updateNav(data);

  if (loading)
    return (
      <>
        <Skeleton variant="rectangular" height={140} sx={{ mb: 10 }} />
        <Skeleton variant="rectangular" height={500} />
      </>
    );

  if (error || !data) {
    return (
      <Paper>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error && <p>{error.toString()}</p>}
          {!data && <p>No Data</p>}
        </Alert>
      </Paper>
    );
  }

  if (!data.instance || !data.instance.results) {
    return (
      <Paper>
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          {!data?.instance && <p>No data reported so far</p>}
          {data?.instance && !data?.instance?.results && (
            <p>
              No results yet for spec <strong>{data.instance.spec}</strong>
            </p>
          )}
        </Alert>
      </Paper>
    );
  }

  return (
    <>
      <Toolbar
        actions={[
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
        ]}
      />
      <InstanceSummary instance={data.instance} />
      <InstanceDetails
        instance={data.instance}
        selectedItem={itemId || testId}
      />
    </>
  );
};

function updateNav(data: GetInstanceQuery | undefined) {
  useLayoutEffect(() => {
    if (!data?.instance) {
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
        label: data.instance?.projectId,
        link: getProjectPath(data.instance?.projectId),
      },
      {
        type: NavItemType.latestRuns,
        label: 'Runs',
        link: getProjectPath(data.instance?.projectId),
      },
      {
        type: NavItemType.run,
        label: data.instance.run?.meta?.ciBuildId,
        link: getRunPath(data.instance?.runId),
      },
      {
        type: NavItemType.spec,
        label: data.instance.spec,
        link: getInstancePath(data.instance.instanceId),
      },
    ]);
  }, [data]);
}

type InstanceDetailsViewProps = {
  // nothing yet
};
type InstanceDetailsViewComponent = FunctionComponent<InstanceDetailsViewProps>;
