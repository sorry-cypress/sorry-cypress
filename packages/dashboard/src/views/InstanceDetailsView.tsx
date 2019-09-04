import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { InstanceSummary } from '../components/instance/summary';
import { Test } from '../components/test/';

const GET_INSTANCE = gql`
  query getInstance($instanceId: ID!) {
    instance(id: $instanceId) {
      instanceId
      results {
        stats {
          suites
          tests
          passes
          pending
          skipped
          failures
          wallClockDuration
        }
        tests {
          wallClockDuration
          state
          error
          title
        }
      }
    }
  }
`;

export function InstanceDetailsView({
  match: {
    params: { id }
  }
}) {
  const { loading, error, data } = useQuery(GET_INSTANCE, {
    variables: { instanceId: id }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( </p>;

  return (
    <div>
      <div>
        <strong>ID:</strong> {data.instance.instanceId}
      </div>
      <InstanceSummary instance={data.instance} />
      <div>
        <strong>Tests: </strong>
        <ul>
          {data.instance.results.tests.map(t => (
            <li key={t.testId}>
              <Test test={t} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
