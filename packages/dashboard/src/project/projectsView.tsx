import { PageControls, SearchField } from '@sorry-cypress/dashboard/components';
import { setNav } from '@sorry-cypress/dashboard/lib/navigation';
import ProjectsList from '@sorry-cypress/dashboard/project/projectList';
import { Button, Icon, Text } from 'bold-ui';
import React, { useLayoutEffect, useState } from 'react';

export function ProjectsView() {
  const [search, setSearch] = useState('');

  useLayoutEffect(() => {
    setNav([]);
  }, []);

  return (
    <>
      <PageControls>
        <SearchField
          placeholder="Enter project id"
          onSearch={(value) => setSearch(value)}
        />
        {/* @ts-ignore */}
        <Button component="a" href="/--create-new-project--/edit">
          <Icon style={{ marginRight: '0.5rem' }} icon="plus" />
          <Text color="inherit">New Project</Text>
        </Button>
      </PageControls>
      <ProjectsList search={search} />
    </>
  );
}
