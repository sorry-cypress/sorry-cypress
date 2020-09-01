import { useApolloClient } from '@apollo/react-hooks';
import { useAutoRefresh } from '@src/hooks/useAutoRefresh';
import React from 'react';
import { RunDetails } from '../components/run/details';
import { RunSummary } from '../components/run/summary';
import { useGetRunQuery, useGetRunsByProjectIdLimitedToTimingQuery } from '../generated/graphql';

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
  let propertySpecHeuristics;
  const apollo = useApolloClient();

  const [shouldAutoRefresh] = useAutoRefresh();

  const { loading: runLoading, error: runError, data: runData } = useGetRunQuery({
    variables: { runId: id },
    pollInterval: shouldAutoRefresh ? 1500 : undefined,
  });

  const { data: runsWithTimingData } = useGetRunsByProjectIdLimitedToTimingQuery({
    variables: {
      filters: [
        {
          key: 'meta.projectId',
          value: runData?.run?.meta?.projectId
        }
      ]
    }
  });

  if (runsWithTimingData) {
    propertySpecHeuristics = runsWithTimingData.runs.reduce((accumulator, runData)=>{
      runData.specs.forEach((spec)=>{
        accumulator[spec.spec] = accumulator[spec.spec] || [];
        if ( spec?.results?.stats?.wallClockDuration ) {
          accumulator[spec.spec].push(spec?.results?.stats?.wallClockDuration)
        }
      });
      return accumulator; 
    },{})
  }

  if (runLoading) return <p>Loading...</p>;
  if (runError) return <p>{runError.toString()}</p>;
  if (!runData) return <p>No data</p>;

  if (!runData.run) {
    apollo.writeData({
      data: {
        navStructure: [
          {
            __typename: 'NavStructureItem',
            label: 'Non-existing run',
            link: `run/missing`,
          },
        ],
      },
    });
    return 'Cannot find this run does not exist';
  }

  apollo.writeData({
    data: {
      navStructure: [
        {
          __typename: 'NavStructureItem',
          label: runData.run!.meta!.ciBuildId,
          link: `run/${runData.run!.runId}`,
        },
      ],
    },
  });

  return (
    <>
      <RunSummary run={runData.run} />
      <RunDetails run={runData.run} propertySpecHeuristics={propertySpecHeuristics} />
    </>
  );
}
