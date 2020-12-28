import ProjectsList from '@src/components/project/ProjectList';
import PageControls from '@src/components/ui/PageControls';
import SearchField from '@src/components/ui/SearchField';
import { navStructure } from '@src/lib/navigation';
import { Button, Icon, Text } from 'bold-ui';
import React, { useLayoutEffect, useState } from 'react';

export function ProjectsView() {
  const [search, setSearch] = useState('');

  useLayoutEffect(() => {
    navStructure([]);
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
