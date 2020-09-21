import { getProjectPath, navStructure } from '@src/lib/navigation';
import { Button } from 'bold-ui';
import React, { useLayoutEffect } from 'react';
import { RunSummary } from '../components/run/summary';
import { useGetRunsFeedQuery } from '../generated/graphql';

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
  return (
    <>
      {runFeed.runs.map((run) => (
        <RunSummary run={run} key={run.runId} />
      ))}
      {runFeed.hasMore && <Button onClick={loadMore}>Load More</Button>}
    </>
  );
}
