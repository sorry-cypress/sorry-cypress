import {
  GetRunQuery,
  useGetRunQuery,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useAutoRefreshRate } from '@sorry-cypress/dashboard/hooks/useAutoRefresh';
import {
  getProjectPath,
  getRunPath,
  NavItemType,
  setNav,
} from '@sorry-cypress/dashboard/lib/navigation';
import { RunSummary } from '@sorry-cypress/dashboard/run/runSummary/runSummary';
import React, { useLayoutEffect } from 'react';
import { RunDetails } from './details';

type RunDetailsViewProps = {
  match: {
    params: {
      id: string;
    };
  };
};
export function RunDetailsView({
  match: {
    params: { id },
  },
}: RunDetailsViewProps) {
  const autoRefreshRate = useAutoRefreshRate();

  const { loading, error, data } = useGetRunQuery({
    variables: { runId: id },
    pollInterval: autoRefreshRate,
  });

  updateNav(data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;
  if (!data) return <p>No data</p>;
  if (!data.run) {
    return <p>Non-existing run</p>;
  }

  return (
    <>
      <RunSummary run={data.run} />
      <RunDetails run={data.run} />
    </>
  );
}

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
