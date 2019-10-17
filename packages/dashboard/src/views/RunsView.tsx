import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { RunSummary } from '../components/run/summary';

const GET_ALL_RUNS = gql`
  query getRunsFeed($cursor: String) {
    runFeed(cursor: $cursor) {
      cursor
      hasMore
      runs {
        runId
        createdAt
        meta {
          ciBuildId
          projectId
          commit {
            branch
            remoteOrigin
            message
            authorEmail
            authorName
          }
        }
        specs {
          spec
          instanceId
          claimed
          results {
            tests {
              title
              state
            }
            stats {
              tests
              pending
              passes
              failures
              skipped
              suites
            }
          }
        }
      }
    }
  }
`;

export function RunsView() {
  const {
    fetchMore,
    loading,
    error,
    data: { runFeed }
  } = useQuery(GET_ALL_RUNS, {
    variables: {
      cursor: ''
    }
  });

  // const [showLoader, setShowLoader] = useState(true);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  let cursor = runFeed.cursor;
  function loadMore() {
    return fetchMore({
      variables: {
        cursor
      },
      updateQuery: (
        prev,
        {
          fetchMoreResult: {
            runFeed: { cursor, hasMore, runs }
          }
        }
      ) => {
        return {
          runFeed: {
            __typename: prev.runFeed.__typename,
            hasMore,
            cursor,
            runs: [...prev.runFeed.runs, ...runs]
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
