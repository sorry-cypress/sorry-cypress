import { useApolloClient } from '@apollo/react-hooks';
import React from 'react';
import { ProjectListItem } from '../components/project/projectListItem';
import { useGetProjectQuery } from '../generated/graphql';
import { Button, Icon, Text, useCss } from 'bold-ui';


export function ProjectEditView({
  match: {
    params: { projectId },
  },
}) {
  const { css } = useCss();
  const apollo = useApolloClient();

  apollo.writeData({
    data: {
      navStructure: [],
    },
  });

  const { loading, error, data, refetch } = useGetProjectQuery({
    variables: {
      projectId: projectId
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;
  if (!data) {
    return <p>No data</p>;
  }
  if (!data.project) {
    return <p>Not a recognized project</p>;
  }

  const project = data.project;

  return (
    <>
      <div className={css`
        display: flex;
        flex-direction: row-reverse;
      `}>
        <Button>
          <Icon style={{ marginRight: '0.5rem' }} icon="plus"/>
          <Text color="inherit">New Project</Text>
        </Button>
      </div>
      project.id
      {project.projectId}
    </>
  );
}
