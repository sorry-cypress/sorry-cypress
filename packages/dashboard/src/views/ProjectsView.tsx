import { navStructure } from '@src/lib/navigation';
import { Button, Icon, Text, useCss } from 'bold-ui';
import React, { useLayoutEffect } from 'react';
import { ProjectListItem } from '../components/project/projectListItem';
import { useGetProjectsQuery } from '../generated/graphql';
export function ProjectsView() {
  const { css } = useCss();

  useLayoutEffect(() => {
    navStructure([]);
  }, []);

  const { loading, error, data, refetch } = useGetProjectsQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;
  if (!data) {
    return <p>No data</p>;
  }

  const projects = data.projects;

  let content: React.ReactNode = null;
  if (!projects.length) {
    content = (
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
  } else {
    content = projects.map((project) => (
      <div key={project.projectId}>
        <ProjectListItem project={project} reloadProjects={refetch} />
      </div>
    ));
  }

  return (
    <>
      <div
        className={css`
          display: flex;
          flex-direction: row-reverse;
        `}
      >
        <Button component="a" href="/--create-new-project--/edit">
          <Icon style={{ marginRight: '0.5rem' }} icon="plus" />
          <Text color="inherit">New Project</Text>
        </Button>
      </div>
      {content}
    </>
  );
}
