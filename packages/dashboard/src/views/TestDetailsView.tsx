import { useAutoRefresh } from '@src/hooks/useAutoRefresh';
import { navStructure } from '@src/lib/navigation';
import React, { useLayoutEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TestDetails } from '../components/test';
import { useGetInstanceQuery } from '../generated/graphql';

export function TestDetailsView(): React.ReactNode {
  const { instanceId, testId } = useParams<{
    instanceId: string;
    testId: string;
  }>();

  const [shouldAutoRefresh] = useAutoRefresh();

  const { loading, error, data } = useGetInstanceQuery({
    variables: { instanceId },
    pollInterval: shouldAutoRefresh ? 1500 : undefined,
  });

  useLayoutEffect(() => {
    if (!data?.instance) {
      return;
    }
    const test = data.instance?.results?.tests?.find(
      (t) => t?.testId === testId
    );
    if (!test) {
      return;
    }
    navStructure([
      {
        label: data.instance.run?.meta?.ciBuildId,
        link: `run/${data.instance.runId}`,
      },
      {
        label: data.instance.spec,
        link: `instance/${instanceId}`,
      },
      {
        label: test.title && test.title.join(' | '),
        link: `instance/${data.instance.instanceId}/test/${testId}`,
      },
    ]);
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data || !data.instance) {
    return <p>No data</p>;
  }
  if (!data.instance.results) {
    return <p>Cannot find results for the spec</p>;
  }

  const test = data.instance?.results?.tests?.find((t) => t.testId === testId);

  if (!test) {
    return <p>Cannot find the specified test</p>;
  }

  if (!test) {
    return (
      <>
        <p>No such test</p>
        <Link to={`/instance/${instanceId}`}>Go back</Link>
      </>
    );
  }
  const screenshots = (data.instance.results?.screenshots ?? []).filter(
    (s) => s.testId === test.testId
  );

  return <TestDetails test={test} screenshots={screenshots} />;
}
