import { useAutoRefresh } from '@src/hooks/useAutoRefresh';
import {
  getInstancePath,
  getProjectPath,
  getRunPath,
  navStructure,
} from '@src/lib/navigation';
import React, { useLayoutEffect } from 'react';
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
}: InstanceDetailsViewProps) {
  const [shouldAutoRefresh] = useAutoRefresh();

  const { loading, error, data } = useGetInstanceQuery({
    variables: { instanceId: id },
    pollInterval: shouldAutoRefresh ? 1500 : undefined,
  });

  useLayoutEffect(() => {
    if (!data?.instance) {
      return;
    }
    navStructure([
      {
        label: data.instance?.run?.meta?.projectId,
        link: getProjectPath(data.instance?.run?.meta?.projectId),
      },
      {
        label: data.instance.run?.meta?.ciBuildId,
        link: getRunPath(data.instance?.runId),
      },
      {
        label: data.instance.spec,
        link: getInstancePath(data.instance.instanceId),
      },
    ]);
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;
  if (!data) return <p>No Data</p>;

  if (!data.instance) {
    return <p>No data reported so far</p>;
  }

  if (!data.instance?.results) {
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
