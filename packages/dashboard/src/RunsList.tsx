import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';

export function RunsList() {
  const { loading, error, data } = useQuery(gql`
    {
      runs {
        runId
        meta {
          ciBuildId
          projectId
          commit {
            remoteOrigin
            message
          }
        }
        specs {
          spec
          instanceId
          claimed
        }
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.runs.map(({ runId, specs }) => (
    <div key={runId}>
      <p>
        {runId}: {specs.length}
      </p>
    </div>
  ));
}
