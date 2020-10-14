import { getProjectPath, navStructure } from '@src/lib/navigation';
import { Button } from 'bold-ui';
import React, { useLayoutEffect } from 'react';
import { RunSummary, RunCiGroupSummary } from '../components/run/summary';
import { FullRunSpec, Run, useGetRunsFeedQuery } from '../generated/graphql';
import { useStackRuns } from '@src/hooks/useStackRuns';

type RunsViewProps = {
  match: {
    params: {
      projectId: string;
    };
  };
};

export function RunsView({
  match: {
    params: { projectId },
  },
}: RunsViewProps) {
  const [shouldStackRuns] = useStackRuns();
  useLayoutEffect(() => {
    navStructure([
      {
        label: projectId,
        link: getProjectPath(projectId),
      },
    ]);
  }, []);

  const { fetchMore, loading, error, data } = useGetRunsFeedQuery({
    variables: {
      filters: [
        {
          key: 'meta.projectId',
          value: projectId,
        },
      ],
      cursor: '',
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;
  if (!data) {
    return <p>No data</p>;
  }

  const runFeed = data.runFeed;

  function loadMore() {
    return fetchMore({
      variables: {
        filters: [
          {
            key: 'meta.projectId',
            value: projectId,
          },
        ],
        cursor: runFeed.cursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          runFeed: {
            __typename: prev.runFeed.__typename,
            hasMore: fetchMoreResult?.runFeed.hasMore,
            cursor: fetchMoreResult?.runFeed.cursor,
            runs: [...prev.runFeed.runs, ...fetchMoreResult?.runFeed.runs],
          },
        };
      },
    });
  }

  if (!runFeed.runs.length) {
    return <div>No runs have started on this project.</div>;
  }

  const groupedRuns: any[] = [];
  data.runFeed.runs.forEach((run) => {
    const ciBuildId = run.meta?.ciBuildId;
    const existingGroup = groupedRuns.find((run) => {
      return run.ciGroupName === ciBuildId;
    });
    existingGroup
      ? existingGroup.runs.push(run)
      : groupedRuns.push({ ciGroupName: ciBuildId, runs: [run] });
  });
  return (
    <>
      {groupedRuns.map((item, index) =>
        item.runs.length > 1 && shouldStackRuns ? (
          <RunCiGroupSummary group={item} key={index} />
        ) : (
          item.runs?.map(
            (
              run: Partial<Run> & { runId: string; specs: Array<FullRunSpec> }
            ) => <RunSummary run={run} key={run.runId} />
          )
        )
      )}
      {runFeed.hasMore && <Button onClick={loadMore}>Load More</Button>}
    </>
  );
}
