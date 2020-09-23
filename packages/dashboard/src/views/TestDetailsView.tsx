import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetInstanceQuery } from '../generated/graphql';
import { useApolloClient } from '@apollo/react-hooks';
import { TestDetails } from '../components/test';

export function TestDetailsView(): React.ReactNode {
  const { instanceId, testId } = useParams();

  const { loading, error, data } = useGetInstanceQuery({
    variables: { instanceId },
  });

  const apollo = useApolloClient();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data || !data.instance) {
    return <p>No data</p>;
  }
  if (!data.instance.results) {
    return <p>Cannot find results for the spec</p>;
  }

  const test = data.instance.results.tests.find((t) => t.testId === testId);

  if (!test) {
    return <p>Cannot find the specified test</p>;
  }

  apollo.writeData({
    data: {
      navStructure: [
        {
          __typename: 'NavStructureItem',
          label: data.instance.run!.meta!.ciBuildId,
          link: `dashboard/run/${data.instance.runId}`,
        },
        {
          __typename: 'NavStructureItem',
          label: data.instance.spec,
          link: `dashboard/instance/${instanceId}`,
        },
        {
          __typename: 'NavStructureItem',
          label: test.title && test.title.join(' | '),
          link: `dashboard/instance/${data.instance.instanceId}/test/${testId}`,
        },
      ],
    },
  });

  if (!test) {
    return (
      <>
        <p>No such test</p>
        <Link to={`/instance/${instanceId}`}>Go back</Link>
      </>
    );
  }
  const screenshots = data.instance.results
    ? data.instance.results.screenshots
    : [];

  return <TestDetails test={test} screenshots={screenshots} />;
}
