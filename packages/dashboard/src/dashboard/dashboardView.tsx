import { Add as AddIcon } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { Toolbar } from '@sorry-cypress/dashboard/components';
import { WithMaterial } from '@sorry-cypress/dashboard/lib/material';
import { setNav } from '@sorry-cypress/dashboard/lib/navigation';
import ProjectsList from '@sorry-cypress/dashboard/project/projectList';
import React, { useLayoutEffect, useState } from 'react';
import { useHistory } from 'react-router';

export function DashboardView() {
  const [search, setSearch] = useState('');
  const history = useHistory();
  useLayoutEffect(() => {
    setNav([]);
  }, []);

  return (
    <WithMaterial>
      <Toolbar
        actions={[
          {
            key: 'newProject',
            text: 'Add New Project',
            primary: true,
            icon: AddIcon,
            onClick: () => {
              history.push('/--create-new-project--/edit');
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
    </WithMaterial>
  );
}
