import { PageControls, SearchField } from '@sorry-cypress/dashboard/components';
import {
  getProjectPath,
  NavItemType,
  setNav,
} from '@sorry-cypress/dashboard/lib/navigation';
import React, { useLayoutEffect, useState } from 'react';
import { RunsFeed } from './runsFeed/runsFeed';

type RunsViewProps = {
  match: {
    params: {
      projectId: string;
    };
  };
};

export function RunsView({
  match: {
    params: { projectId },
  },
}: RunsViewProps) {
  const [search, setSearch] = useState('');

  useLayoutEffect(() => {
    setNav([
      {
        type: NavItemType.project,
        label: projectId,
        link: getProjectPath(projectId),
      },
      {
        type: NavItemType.latestRuns,
        label: 'Latest runs',
      },
    ]);
  }, []);

  return (
    <>
      <PageControls>
        <SearchField placeholder="Enter run build id" onSearch={setSearch} />
      </PageControls>
      <RunsFeed projectId={projectId} search={search} />
    </>
  );
}
