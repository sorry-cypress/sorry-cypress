import { PageControls, SearchField } from '@src/components';
import { setNav } from '@src/lib/navigation';
import ProjectsList from '@src/project/projectList';
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
        <Button component="a" href="/--create-new-project--/edit">
          <Icon style={{ marginRight: '0.5rem' }} icon="plus" />
          <Text color="inherit">New Project</Text>
        </Button>
      </PageControls>
      <ProjectsList search={search} />
    </>
  );
}
