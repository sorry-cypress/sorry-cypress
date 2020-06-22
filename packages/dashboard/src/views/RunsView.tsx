import React from 'react';
import { RunSummary } from '../components/run/summary';
import { useGetRunsFeedQuery } from '../generated/graphql';
import { Button } from 'bold-ui';
import { useApolloClient } from '@apollo/react-hooks';
import { useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

export function RunsView() {
  const apollo = useApolloClient();

  apollo.writeData({
    data: {
      navStructure: [],
    },
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search?.substring(1));

  const { fetchMore, loading, error, data } = useGetRunsFeedQuery({
    variables: {
      cursor: '',
      branch: searchParams.get('branch'),
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
        Pas de résultats.{' '}
        <a
          href="https://github.com/padoa/sorry-cypress"
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
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={runFeed.hasMore}
        threshold={0.7 * window.innerHeight}
        loader={<div style={{ textAlign: 'center' }}>loading more 🚀</div>}
      >
        {runFeed.runs.map((run) => (
          <div key={run.meta?.ciBuildId}>
            <RunSummary run={run} />
          </div>
        ))}
      </InfiniteScroll>
    </>
  );
}
