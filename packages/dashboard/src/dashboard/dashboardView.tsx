import { Add as AddIcon, Loop as LoopIcon } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { Toolbar } from '@sorry-cypress/dashboard/components';
import { setNav } from '@sorry-cypress/dashboard/lib/navigation';
import ProjectsList from '@sorry-cypress/dashboard/project/projectList';
import React, { useLayoutEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAutoRefresh } from '../hooks';

export function DashboardView() {
  const [search, setSearch] = useState('');
  const history = useHistory();
  const [shouldAutoRefresh, setShouldAutoRefresh] = useAutoRefresh();
  useLayoutEffect(() => {
    setNav([]);
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
              history.push('/--create-new-project--/edit');
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
