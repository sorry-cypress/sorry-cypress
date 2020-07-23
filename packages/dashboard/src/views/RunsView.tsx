import { useApolloClient } from '@apollo/react-hooks';
import { Button } from 'bold-ui';
import React from 'react';
import { RunSummary } from '../components/run/summary';
import { useGetRunsFeedQuery } from '../generated/graphql';

export function RunsView() {
  const apollo = useApolloClient();

  apollo.writeData({
    data: {
      navStructure: [],
    },
  });

  const { fetchMore, loading, error, data } = useGetRunsFeedQuery({
    variables: {
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
        cursor: runFeed.cursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          runFeed: {
            __typename: prev.runFeed.__typename,
            hasMore: fetchMoreResult!.runFeed.hasMore,
            cursor: fetchMoreResult!.runFeed.cursor,
            runs: [...prev.runFeed.runs, ...fetchMoreResult!.runFeed.runs],
          },
        };
      },
    });
  }

  if (!runFeed.runs.length) {
    return (
      <div>
        Welcome to Sorry Cypress! Your tests runs will appears here.{' '}
        <a
          href="https://github.com/agoldis/sorry-cypress"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </a>
      </div>
    );
  }
  return (
    <>
      {runFeed.runs.map((run) => (
        <div key={run.runId}>
          <RunSummary run={run} />
        </div>
      ))}
      {runFeed.hasMore && <Button onClick={loadMore}>Load More</Button>}
    </>
  );
}
