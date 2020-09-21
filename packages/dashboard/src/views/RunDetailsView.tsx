import { useAutoRefresh } from '@src/hooks/useAutoRefresh';
import { navStructure } from '@src/lib/navigation';
import React, { useLayoutEffect } from 'react';
import { RunDetails } from '../components/run/details';
import { RunSummary } from '../components/run/summary';
import {
  GetRunsByProjectIdLimitedToTimingQuery,
  useGetRunQuery,
  useGetRunsByProjectIdLimitedToTimingQuery,
} from '../generated/graphql';

function getSpecTimingsList(
  runsWithTimingData: GetRunsByProjectIdLimitedToTimingQuery
) {
  return runsWithTimingData.runs.reduce<Record<string, number[]>>(
    (accumulator, runData) => {
      runData?.specs.forEach((spec) => {
        if (!spec) {
          return accumulator;
        }
        accumulator[spec.spec] = accumulator[spec.spec] || [];
        if (spec?.results?.stats?.wallClockDuration) {
          accumulator[spec.spec].push(spec?.results?.stats?.wallClockDuration);
        }
      });
      return accumulator;
    },
    {}
  );
}
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
}: RunDetailsViewProps): React.ReactNode {
  // const apollo = useApolloClient();
  const [shouldAutoRefresh] = useAutoRefresh();

  const {
    loading: runLoading,
    error: runError,
    data: runData,
  } = useGetRunQuery({
    variables: { runId: id },
    pollInterval: shouldAutoRefresh ? 1500 : undefined,
  });

  const {
    data: runsWithTimingData,
  } = useGetRunsByProjectIdLimitedToTimingQuery({
    variables: {
      filters: [
        {
          key: 'meta.projectId',
          value: runData?.run?.meta?.projectId,
        },
      ],
    },
  });
  useLayoutEffect(() => {
    if (!runData?.run) {
      navStructure([]);
      return;
    }

    navStructure([
      {
        label: runData?.run?.meta?.ciBuildId,
        link: `run/${runData?.run?.runId}`,
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
      <RunDetails
        run={runData.run}
        propertySpecHeuristics={
          runsWithTimingData ? getSpecTimingsList(runsWithTimingData) : {}
        }
      />
    </>
  );
}
