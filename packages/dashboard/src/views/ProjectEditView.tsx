import { useApolloClient } from '@apollo/react-hooks';
import React, { useState } from 'react';
import { useGetProjectQuery, useCreateProjectMutation, useUpdateProjectMutation } from '../generated/graphql';
import { Button, Icon, Tooltip, TextField, Grid, Cell } from 'bold-ui';
import { useHistory } from "react-router-dom";

type ProjectEditViewProps = {
  match: {
    params: {
      projectId: string;
    };
  };
};

export function ProjectEditView({
  match: {
    params: { projectId },
  },
}:ProjectEditViewProps) {
  const history = useHistory();
  const apollo = useApolloClient();
  const isNewProject = projectId === '--create-new-project--';
  apollo.writeData({
    data: {
      navStructure: [],
    },
  });
  

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const {loading, error, data} = useGetProjectQuery({
    variables: {
      projectId: projectId
    }
  });

  const [formState, setFormState] = useState(data?.project || {
    projectId: isNewProject ? '' : projectId,
    //other project fields
  });

  const [startCreateProjectMutation] = useCreateProjectMutation({
    variables:{
      project: formState
    }
  });

  const [startUpdateProjectMutation] = useUpdateProjectMutation ({
    variables:{
      project: formState
    }
  });


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function updateProject() {
    setUpdating(true);
    startUpdateProjectMutation().then((result) => {
      if (result.errors) {
        setUpdateError(result.errors[0].message);
      } else {
        history.push(`/${result.data?.updateProject.projectId}/runs`);
      }
      setUpdating(false);
    }).catch((error) => {
      setUpdating(false);
      setUpdateError(error.toString());
    });
  }

  function createProject() {
    setCreating(true);
    startCreateProjectMutation().then((result) => {
      if (result.errors) {
        setCreateError(result.errors[0].message);
      } else {
        history.push(`/${result.data?.createProject.projectId}/runs`);
      }
      setCreating(false);
    }).catch((error) => {
      setCreating(false);
      setCreateError(error.toString());
    });
  }

  if (!isNewProject) {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error.toString()}</p>;
    if (!data) {
      return <p>No data</p>;
    }
    if (!data.project) {
      return <p>Not a recognized project</p>;
    }
  }


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isNewProject) {
      createProject();
    }else {
      // updateProject();
    }
  }

  const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target

    setFormState(state => ({
      ...state,
      [name]: el.type === 'checkbox' ? el.checked : el.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      {createError || updateError ? (
        <div>
          {createError || updateError}
        </div>
      ): null}
      <Grid wrap>
        <Cell xs={6}>
          <TextField
            name='projectId'
            label='Project Id'
            placeholder='Enter your "projectId"'
            value={formState.projectId}
            onChange={handleChange('projectId')}
            disabled={!isNewProject || creating || updating || loading}
            required
          />
        </Cell>
        <div style={{
          display: 'flex',
          alignSelf: 'flex-end',
          marginBottom: '14px'
        }}>
          <Tooltip text='This must match the "projectId" value in your cypress.json configuration.'>
            <Icon icon='infoCircleOutline' style={{}}/>
          </Tooltip>
        </div>
      </Grid>

      <div style={{marginTop:'32px'}}>
        <Button
          style={{marginRight:'15px'}}
          component="a"
          href="/"
          disabled={creating || updating}
        >
          Cancel
        </Button>
        {/*
          You cannot update a project id once it is created.
          That is the only editable field right now. So we disable saving for now.
        */}
        <Button
          type='submit'
          kind='primary'
          disabled={!isNewProject || creating || updating || loading}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
