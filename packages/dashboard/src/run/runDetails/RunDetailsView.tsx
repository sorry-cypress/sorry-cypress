import { useGetRunQuery } from '@src/generated/graphql';
import { useAutoRefresh } from '@src/hooks/useAutoRefresh';
import { getProjectPath, getRunPath, navStructure } from '@src/lib/navigation';
import { RunSummary } from '@src/run/runSummary/summary';
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
  const [shouldAutoRefresh] = useAutoRefresh();

  const { loading, error, data } = useGetRunQuery({
    variables: { runId: id },
    pollInterval: shouldAutoRefresh ? 1500 : undefined,
  });

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;
  if (!data) return <p>No data</p>;
  if (!data.run) {
    return 'Non-existing run';
  }

  return (
    <>
      <RunSummary run={data.run} />
      <RunDetails run={data.run} />
    </>
  );
}
