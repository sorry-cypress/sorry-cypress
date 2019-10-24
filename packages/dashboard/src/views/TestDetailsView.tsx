import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetInstanceQuery } from '../generated/graphql';
import { useApolloClient } from '@apollo/react-hooks';
import { TestDetails } from '../components/test';

export const TestDetailsView: React.FC = props => {
  const { instanceId, testId } = useParams();

  const { loading, error, data } = useGetInstanceQuery({
    variables: { instanceId }
  });

  const apollo = useApolloClient();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data || !data.instance) {
    return <p>No data</p>;
  }
  const test = data.instance!.results!.tests.find(t => t.testId === testId);

  apollo.writeData({
    data: {
      navStructure: [
        {
          __typename: 'NavStructureItem',
          label: data.instance.run!.meta!.ciBuildId,
          link: `run/${data.instance.runId}`
        },
        {
          __typename: 'NavStructureItem',
          label: data.instance.spec,
          link: `instance/${instanceId}`
        },
        {
          __typename: 'NavStructureItem',
          label: test.title.join(' | '),
          link: `instance/${data.instance.instanceId}/test/${testId}`
        }
      ]
    }
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
};
