import React from 'react';
import { RunDetails } from '../components/run/details';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { RunSummary } from '../components/run/summary';

const GET_RUN = gql`
  query getRun($runId: ID!) {
    run(id: $runId) {
      runId
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
`;

export function RunDetailsView({
  match: {
    params: { id }
  }
}) {
  const { loading, error, data } = useQuery(GET_RUN, {
    variables: { runId: id }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( </p>;

  return (
    <>
      <RunSummary run={data.run} />
      <RunDetails run={data.run} />
    </>
  );
}
