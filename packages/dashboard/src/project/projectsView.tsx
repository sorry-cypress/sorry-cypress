import { Add as AddIcon, Loop as LoopIcon } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { Toolbar } from '@sorry-cypress/dashboard/components';
import { NavItemType, setNav } from '@sorry-cypress/dashboard/lib/navigation';
import ProjectsList from '@sorry-cypress/dashboard/project/projectList';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutoRefresh } from '../hooks';

export function ProjectsView() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
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
            selected: !!shouldAutoRefresh,
            onClick: () => {
              setShouldAutoRefresh(!shouldAutoRefresh);
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
