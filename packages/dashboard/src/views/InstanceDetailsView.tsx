import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { InstanceSummary } from '../components/instance/summary';
import { Test, TestDetails } from '../components/test/';

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
          testId
          wallClockDuration
          state
          error
          title
        }
        screenshots {
          testId
          screenshotId
          height
          width
          screenshotURL
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

  const [detailedTestId, setDetailedTestId] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( </p>;

  const tests = data.instance.results.tests;
  const screenshots = data.instance.results.screenshots;
  return (
    <div>
      <div>
        <strong>ID:</strong> {data.instance.instanceId}
      </div>
      <InstanceSummary instance={data.instance} />
      <div>
        <strong>Tests (click for details): </strong>
        <ul>
          {tests.map(t => (
            <li key={t.testId}>
              <Test test={t} onClick={setDetailedTestId} />
            </li>
          ))}
        </ul>

        <strong>Details</strong>
        {detailedTestId && (
          <TestDetails
            test={tests.find(t => t.testId === detailedTestId)}
            screenshots={screenshots}
          />
        )}
      </div>
    </div>
  );
}
