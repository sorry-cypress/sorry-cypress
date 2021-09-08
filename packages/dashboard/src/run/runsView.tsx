import { PageControls, SearchField } from '@sorry-cypress/dashboard/components';
import {
  getProjectPath,
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
        label: projectId,
        link: getProjectPath(projectId),
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
