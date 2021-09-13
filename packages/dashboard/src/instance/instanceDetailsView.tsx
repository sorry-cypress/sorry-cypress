import {
  GetInstanceQuery,
  useGetInstanceQuery,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useAutoRefreshRate } from '@sorry-cypress/dashboard/hooks/useAutoRefresh';
import {
  getInstancePath,
  getProjectPath,
  getRunPath,
  NavItemType,
  setNav,
} from '@sorry-cypress/dashboard/lib/navigation';
import React, { useLayoutEffect } from 'react';
import { InstanceDetails } from './details';
import { InstanceSummary } from './summary';

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
  const autoRefreshRate = useAutoRefreshRate();
  const { loading, error, data } = useGetInstanceQuery({
    variables: { instanceId: id },
    pollInterval: autoRefreshRate,
  });
  updateNav(data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;
  if (!data) return <p>No Data</p>;

  if (!data.instance) {
    return <p>No data reported so far</p>;
  }

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

function updateNav(data: GetInstanceQuery | undefined) {
  useLayoutEffect(() => {
    if (!data?.instance) {
      return;
    }
    setNav([
      {
        type: NavItemType.project,
        label: data.instance?.projectId,
        link: getProjectPath(data.instance?.projectId),
      },
      {
        type: NavItemType.latestRuns,
        label: 'Runs',
        link: getProjectPath(data.instance?.projectId),
      },
      {
        type: NavItemType.run,
        label: data.instance.run?.meta?.ciBuildId,
        link: getRunPath(data.instance?.runId),
      },
      {
        type: NavItemType.spec,
        label: data.instance.spec,
        link: getInstancePath(data.instance.instanceId),
      },
    ]);
  }, [data]);
}
