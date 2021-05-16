import { CenteredContent } from '@src/components';
import { useGetProjectsQuery } from '@src/generated/graphql';
import { ProjectListItem } from '@src/project/projectListItem';
import { Heading } from 'bold-ui';
import React from 'react';

type ProjectsListProps = {
  search: string;
};

const ProjectsList = ({ search }: ProjectsListProps) => {
  const queryOptions = {
    variables: {
      filters: search
        ? [
            {
              key: 'projectId',
              like: search,
            },
          ]
        : [],
    },
  };

  const { loading, error, data, refetch } = useGetProjectsQuery(queryOptions);

  if (loading) {
    return <CenteredContent>Loading ...</CenteredContent>;
  }
  if (!data || error) {
    return (
      <CenteredContent>
        {(error && error.toString()) || 'Oups an error occured'}
      </CenteredContent>
    );
  }

  const { projects } = data;

  if (projects.length === 0) {
    if (search) {
      return (
        <CenteredContent>
          <p>No projects found </p>
        </CenteredContent>
      );
    }

    return (
      <CenteredContent>
        <Heading level={1}>Welcome to Sorry Cypress!</Heading>
        <p>
          Your projects will appear here.{' '}
          <a
            href="https://github.com/agoldis/sorry-cypress"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </p>
      </CenteredContent>
    );
  }

  return (
    <>
      {projects.map((project) => (
        <div key={project.projectId}>
          <ProjectListItem project={project} reloadProjects={refetch} />
        </div>
      ))}
    </>
  );
};

export default ProjectsList;
