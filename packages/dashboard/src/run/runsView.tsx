import {
  Bolt as BoltIcon,
  Compress as CompressIcon,
  Loop as LoopIcon,
} from '@mui/icons-material';
import { Toolbar } from '@sorry-cypress/dashboard/components';
import {
  getProjectPath,
  NavItemType,
  setNav,
} from '@sorry-cypress/dashboard/lib/navigation';
import React, { FunctionComponent, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAutoRefresh } from '../hooks';
import { RunsFeed } from './runsFeed/runsFeed';

export const RunsView: RunsViewComponent = () => {
  const { projectId } = useParams();

  const [search, setSearch] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [shouldAutoRefresh, setShouldAutoRefresh] = useAutoRefresh();

  useLayoutEffect(() => {
    setNav([
      {
        type: NavItemType.projects,
        label: 'Projects',
        link: './projects',
      },
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
            showInMenuBreakpoint: ['xs'],
            icon: CompressIcon,
            toggleButton: true,
            selected: compactView,
            onClick: () => {
              setCompactView(!compactView);
            },
          },
          {
            key: 'autoRefresh',
            text: 'Auto Refresh',
            icon: LoopIcon,
            toggleButton: true,
            selected: !!shouldAutoRefresh,
            onClick: () => {
              setShouldAutoRefresh(!shouldAutoRefresh);
              window.location.reload();
            },
          },
        ]}
        searchPlaceholder="Enter run build id"
        onSearch={setSearch}
      />
      <RunsFeed
        projectId={projectId!}
        search={search}
        showActions={showActions}
        compact={compactView}
      />
    </>
  );
};

type RunsViewProps = {
  // nothing
};
type RunsViewComponent = FunctionComponent<RunsViewProps>;
