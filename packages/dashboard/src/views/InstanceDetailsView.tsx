import React from 'react';
import { InstanceSummary } from '../components/instance/summary';
import { InstanceDetails } from '../components/instance/details';
import { useGetInstanceQuery } from '../generated/graphql';
import { useApolloClient } from '@apollo/react-hooks';

type InstanceDetailsViewProps = {
  match: {
    params: {
      id: string;
    };
  };
};
export function InstanceDetailsView({
  match: {
    params: { id },
  },
}: InstanceDetailsViewProps): React.ReactNode {
  const { loading, error, data } = useGetInstanceQuery({
    variables: { instanceId: id },
  });
  const apollo = useApolloClient();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;
  if (!data) return <p>No Data</p>;

  if (!data.instance) {
    return <p>No data reported so far</p>;
  }

  apollo.writeData({
    data: {
      navStructure: [
        {
          __typename: 'NavStructureItem',
          label: data.instance!.run!.meta!.ciBuildId,
          link: `run/${data.instance!.runId}`,
        },
        {
          __typename: 'NavStructureItem',
          label: data.instance.spec,
          link: `instance/${data.instance.instanceId}`,
        },
      ],
    },
  });
  if (!data.instance.results) {
    return (
      <div>
        The instance <strong>{data.instance.spec}</strong> has no results yet
      </div>
    );
  }

  return (
    <>
      <InstanceSummary instance={data.instance} />
      <InstanceDetails instance={data.instance} />
    </>
  );
}
