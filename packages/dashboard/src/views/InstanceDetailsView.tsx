import { useApolloClient } from '@apollo/react-hooks';
import { useAutoRefresh } from '@src/hooks/useAutoRefresh';
import React from 'react';
import { InstanceDetails } from '../components/instance/details';
import { InstanceSummary } from '../components/instance/summary';
import { useGetInstanceQuery } from '../generated/graphql';

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
  const [shouldAutoRefresh] = useAutoRefresh();

  const { loading, error, data } = useGetInstanceQuery({
    variables: { instanceId: id },
    pollInterval: shouldAutoRefresh ? 1500 : undefined,
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
          label: data.instance!.run!.meta!.projectId,
          link: `${data.instance!.run!.meta!.projectId}/runs`,
        },
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
        No results yet for spec <strong>{data.instance.spec}</strong>
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
