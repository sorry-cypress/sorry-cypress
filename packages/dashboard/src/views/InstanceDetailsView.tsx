import React, { useState } from 'react';
import { InstanceSummary } from '../components/instance/summary';
import { Test, TestDetails } from '../components/test/';
import { useGetInstanceQuery } from '../generated/graphql';

export function InstanceDetailsView({
  match: {
    params: { id }
  }
}) {
  const { loading, error, data } = useGetInstanceQuery({
    variables: { instanceId: id }
  });

  const [detailedTestId, setDetailedTestId] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( </p>;
  if (!data) return <p>No Data</p>;

  if (!data.instance) {
    return 'No data reported so far';
  }

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
