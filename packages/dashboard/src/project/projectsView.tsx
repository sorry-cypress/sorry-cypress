import {
  Add as AddIcon,
  InvertColors as ColorIcon,
  InvertColorsOff as ColorOffIcon,
  Loop as LoopIcon,
  Sync as SyncIcon,
  SyncDisabled as SyncDisabledIcon,
} from '@mui/icons-material';
import { Typography } from '@mui/material';
import { Toolbar } from '@sorry-cypress/dashboard/components';
import { useBackgroundColorOnProjectListItem } from '@sorry-cypress/dashboard/hooks/useBackgroundColorOnProjectListItem';
import { NavItemType, setNav } from '@sorry-cypress/dashboard/lib/navigation';
import ProjectsList from '@sorry-cypress/dashboard/project/projectList';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAutoRefresh,
  useShowTestsAreRunningOnProjectListItem,
} from '../hooks';

export function ProjectsView() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [
    shouldUseBackgroundColorOnProjectListItem,
    setShouldUseBackgroundColorOnProjectListItem,
  ] = useBackgroundColorOnProjectListItem();
  const [
    shouldUseShowTestsAreRunningOnProjectListItem,
    setShouldUseShowTestsAreRunningOnProjectListItem,
  ] = useShowTestsAreRunningOnProjectListItem();
  const [shouldAutoRefresh, setShouldAutoRefresh] = useAutoRefresh();

  useLayoutEffect(() => {
    setNav([
      {
        type: NavItemType.projects,
        label: 'Projects',
      },
    ]);
  }, []);

  return (
    <>
      <Toolbar
        actions={[
          {
            key: 'newProject',
            text: 'Add New Project',
            icon: AddIcon,
            onClick: () => {
              navigate('/--create-new-project--/edit');
            },
          },
          {
            key: 'autoRefresh',
            text: 'Auto Refresh',
            icon: LoopIcon,
            toggleButton: true,
            selected: shouldAutoRefresh,
            onClick: () => {
              setShouldAutoRefresh(!shouldAutoRefresh);
              window.location.reload();
            },
          },
          {
            key: 'backgroundColor',
            text: 'Use Project Background Color',
            icon: shouldUseBackgroundColorOnProjectListItem
              ? ColorIcon
              : ColorOffIcon,
            toggleButton: true,
            selected: shouldUseBackgroundColorOnProjectListItem,
            onClick: () => {
              setShouldUseBackgroundColorOnProjectListItem(
                !shouldUseBackgroundColorOnProjectListItem
              );
              window.location.reload();
            },
          },
          {
            key: 'showIfTestAreInProgress',
            text: 'Show Tests In Progress',
            icon: shouldUseShowTestsAreRunningOnProjectListItem
              ? SyncIcon
              : SyncDisabledIcon,
            toggleButton: true,
            selected: shouldUseShowTestsAreRunningOnProjectListItem,
            onClick: () => {
              setShouldUseShowTestsAreRunningOnProjectListItem(
                !shouldUseShowTestsAreRunningOnProjectListItem
              );
              window.location.reload();
            },
          },
        ]}
        searchPlaceholder="Enter project id"
        onSearch={setSearch}
      />
      <Typography
        component="h1"
        variant="h6"
        color="text.primary"
        sx={{ mb: 5 }}
      >
        Projects
      </Typography>
      <ProjectsList search={search} />
    </>
  );
}
