import { useAutoRefresh } from '@src/hooks/useAutoRefresh';
import {
  getInstancePath,
  getProjectPath,
  getRunPath,
  getTestPath,
  navStructure,
} from '@src/lib/navigation';
import React, { useLayoutEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TestDetails } from './TestDetails';
import { useGetInstanceQuery } from '@src/generated/graphql';

export function TestDetailsView() {
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
        label: data.instance?.run?.meta?.projectId,
        link: getProjectPath(data.instance?.run?.meta?.projectId),
      },
      {
        label: data.instance.run?.meta?.ciBuildId,
        link: getRunPath(data.instance.runId),
      },
      {
        label: data.instance.spec,
        link: getInstancePath(instanceId),
      },
      {
        label: test.title && test.title.join(' | '),
        link: getTestPath(data.instance.instanceId, testId),
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
