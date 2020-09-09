import { useApolloClient } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import React from 'react';
import { useGetProjectsQuery } from '../generated/graphql';

export function ProjectsView() {
  const apollo = useApolloClient();

  apollo.writeData({
    data: {
      navStructure: [],
    },
  });

  const { loading, error, data } = useGetProjectsQuery();

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
      {projects.map((project) => (
        <div key={project.projectId}>
          <Link to={`/${project.projectId}/runs`}>{project.projectId}</Link>
        </div>
      ))}
    </>
  );
}
