import React from 'react';
import { RunSummary } from '../components/run/summary';
import { useGetRunsFeedQuery } from '../generated/graphql';

export function RunsView() {
  const { fetchMore, loading, error, data } = useGetRunsFeedQuery({
    variables: {
      cursor: ''
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data) {
    return <p>No data</p>;
  }

  const runFeed = data.runFeed!;

  function loadMore() {
    return fetchMore({
      variables: {
        cursor: runFeed.cursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          runFeed: {
            __typename: prev.runFeed.__typename,
            hasMore: fetchMoreResult!.runFeed.hasMore,
            cursor: runFeed.cursor,
            runs: [...prev.runFeed.runs, ...fetchMoreResult!.runFeed.runs]
          }
        };
      }
    });
  }

  return (
    <>
      {runFeed.runs.map(run => (
        <div key={run.runId}>
          <RunSummary run={run} />
        </div>
      ))}
      {runFeed.hasMore && <button onClick={loadMore}>load more</button>}
    </>
  );
}
