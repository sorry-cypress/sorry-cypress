import {
  Bolt as BoltIcon,
  Compress as CompressIcon,
} from '@mui/icons-material';
import { Toolbar } from '@sorry-cypress/dashboard/components';
import {
  getProjectPath,
  NavItemType,
  setNav,
} from '@sorry-cypress/dashboard/lib/navigation';
import React, { FunctionComponent, useLayoutEffect, useState } from 'react';
import { RunsFeed } from './runsFeed/runsFeed';

export const RunsView: RunsViewComponent = (props) => {
  const {
    match: {
      params: { projectId },
    },
  } = props;

  const [search, setSearch] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [compactView, setCompactView] = useState(false);

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
      <Toolbar
        actions={[
          {
            key: 'showActions',
            text: 'Show actions',
            primary: showActions,
            icon: BoltIcon,
            selected: showActions,
            toggleButton: true,
            onClick: () => {
              setShowActions(!showActions);
            },
          },
          {
            key: 'compactView',
            text: 'Compact view',
            primary: compactView,
            icon: CompressIcon,
            toggleButton: true,
            selected: compactView,
            onClick: () => {
              setCompactView(!compactView);
            },
          },
        ]}
        searchPlaceholder="Enter run build id"
        onSearch={setSearch}
      />
      <RunsFeed
        projectId={projectId}
        search={search}
        showActions={showActions}
        compact={compactView}
      />
    </>
  );
};

type RunsViewProps = {
  match: {
    params: {
      projectId: string;
    };
  };
};
type RunsViewComponent = FunctionComponent<RunsViewProps>;
