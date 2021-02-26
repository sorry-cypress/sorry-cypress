import { useGetRunQuery } from '@src/generated/graphql';
import { useAutoRefreshRate } from '@src/hooks/useAutoRefresh';
import { getProjectPath, getRunPath, navStructure } from '@src/lib/navigation';
import { RunSummaryComponent } from '@src/run/runSummary/summary';
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
    return 'Non-existing run';
  }

  return (
    <>
      <RunSummaryComponent run={data.run} runId={id} />
      <RunDetails run={data.run} />
    </>
  );
}

const updateNav = (data) =>
  useLayoutEffect(() => {
    if (!data?.run) {
      navStructure([]);
      return;
    }

    navStructure([
      {
        label: data.run.meta.projectId,
        link: getProjectPath(data.run.meta.projectId),
      },
      {
        label: data.run.meta.ciBuildId,
        link: getRunPath(data.run.runId),
      },
    ]);
  }, [data]);
