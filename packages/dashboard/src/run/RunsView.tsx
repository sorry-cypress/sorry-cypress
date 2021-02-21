import PageControls from '@src/components/ui/PageControls';
import SearchField from '@src/components/ui/SearchField';
import { getProjectPath, navStructure } from '@src/lib/navigation';
import React, { useLayoutEffect, useState } from 'react';
import { RunsFeed } from './runsFeed/RunsFeed';

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
    navStructure([
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
