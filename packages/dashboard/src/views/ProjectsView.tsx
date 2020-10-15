import { navStructure } from '@src/lib/navigation';
import { Button, Icon, Text } from 'bold-ui';
import React, { FC, useLayoutEffect, useState } from 'react';
import { ProjectListItem } from '../components/project/projectListItem';
import { useGetProjectsQuery } from '../generated/graphql';
import PageControls from "../components/ui/PageControls";
import SearchField from "@src/components/ui/SearchField";

type ProjectsListProps = {
  search: string;
};

const ProjectsList = ({ search }: ProjectsListProps) => {
  const queryOptions = {
    variables: {
      filters: search ? [{
        key: 'projectId',
        like: search
      }] : [],
    }
  };

  const { loading, error, data, refetch } = useGetProjectsQuery(queryOptions);

  if (loading) return <p>Loading ...</p>;
  if (!data || error) return <p>{ error && error.toString() || 'Oups an error occured' }</p>;

  const { projects } = data;

  if (projects.length === 0) {
    return (
      <div>
        Welcome to Sorry Cypress! Your projects will appears here.{ ' ' }
        <a
          href="https://github.com/agoldis/sorry-cypress"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </a>
      </div>
    );
  }

  return (
    <>
      {projects.map((project) => (
      <div key={ project.projectId }>
        <ProjectListItem project={ project } reloadProjects={ refetch }/>
      </div>
      ))}
    </>
  );
};

export function ProjectsView() {
  const [search, setSearch] = useState('');

  useLayoutEffect(() => {
    navStructure([]);
  }, []);

  return (
    <>
      <PageControls>
        <SearchField
          label="Search Project"
          placeholder="Search Project"
          onSearch={ (value) => setSearch(value) }/>
        <Button component="a" href="/--create-new-project--/edit">
          <Icon style={ { marginRight: '0.5rem' } } icon="plus"/>
          <Text color="inherit">New Project</Text>
        </Button>
      </PageControls>
      <ProjectsList search={ search }/>
    </>
  );
}
