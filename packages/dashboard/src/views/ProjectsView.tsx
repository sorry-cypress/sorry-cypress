import { useApolloClient } from '@apollo/react-hooks';
import React from 'react';
import { ProjectListItem } from '../components/project/projectListItem';
import { useGetProjectsQuery } from '../generated/graphql';
import { Button, Icon, Text, useCss } from 'bold-ui';
export function ProjectsView() {
  const { css } = useCss();
  const apollo = useApolloClient();

  apollo.writeData({
    data: {
      navStructure: [],
    },
  });

  const { loading, error, data, refetch } = useGetProjectsQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;
  if (!data) {
    return <p>No data</p>;
  }

  const projects = data.projects;

  if (!projects.length) {
    return (
      <div>
        Welcome to Sorry Cypress! Your projects will appears here.{' '}
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
      <div className={css`
        display: flex;
        flex-direction: row-reverse;
      `}>
        <Button
          component="a"
          href="/--create-new-project--/edit"
        >
          <Icon style={{ marginRight: '0.5rem' }} icon="plus"/>
          <Text color="inherit">New Project</Text>
        </Button>
      </div>
      {projects.map((project) => (
        <div key={project.projectId}>
          <ProjectListItem project={project} reloadProjects={refetch}/>
        </div>
      ))}
    </>
  );
}
