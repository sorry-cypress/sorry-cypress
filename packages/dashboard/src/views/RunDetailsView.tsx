import { useAutoRefresh } from '@src/hooks/useAutoRefresh';
import { getProjectPath, getRunPath, navStructure } from '@src/lib/navigation';
import React, { useLayoutEffect } from 'react';
import { RunDetails } from '../components/run/details';
import { RunSummary } from '../components/run/summary';
import { useGetRunQuery } from '../generated/graphql';

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

  const {
    loading: runLoading,
    error: runError,
    data: runData,
  } = useGetRunQuery({
    variables: { runId: id },
    pollInterval: shouldAutoRefresh ? 1500 : undefined,
  });

  useLayoutEffect(() => {
    if (!runData?.run) {
      navStructure([]);
      return;
    }

    navStructure([
      {
        label: runData.run.meta?.projectId,
        link: getProjectPath(runData.run.meta?.projectId),
      },
      {
        label: runData?.run?.meta?.ciBuildId,
        link: getRunPath(runData?.run?.runId),
      },
    ]);
  }, [runData]);

  if (runLoading) return <p>Loading...</p>;
  if (runError) return <p>{runError.toString()}</p>;
  if (!runData) return <p>No data</p>;
  if (!runData?.run) {
    return 'Non-existing run';
  }

  return (
    <>
      <RunSummary run={runData.run} />
      <RunDetails run={runData.run} />
    </>
  );
}
