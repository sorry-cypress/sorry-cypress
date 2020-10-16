import React from 'react';
import { useGetProjectsQuery } from '@src/generated/graphql';
import { ProjectListItem } from '@src/components/project/projectListItem';

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

  if (loading) return <p>Loading ...</p>;
  if (!data || error)
    return <p>{(error && error.toString()) || 'Oups an error occured'}</p>;

  const { projects } = data;

  if (projects.length === 0) {
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
      {projects.map((project) => (
        <div key={project.projectId}>
          <ProjectListItem project={project} reloadProjects={refetch} />
        </div>
      ))}
    </>
  );
};

export default ProjectsList;
