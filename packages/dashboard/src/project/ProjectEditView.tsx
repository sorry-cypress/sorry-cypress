import React, { useState, useLayoutEffect, useReducer } from 'react';
import {
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from '../generated/graphql';
import {
  Button,
  Icon,
  Tooltip,
  TextField,
  Grid,
  Cell,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
} from 'bold-ui';
import { useHistory } from 'react-router-dom';
import clonedeep from 'lodash.clonedeep';
import { Hook, Project } from '@src/duplicatedFromDirector/project.types';
import { navStructure } from '@src/lib/navigation';

import { HookEdit } from './HookEdit';
import {
  HooksFormState,
  hookFormReducer,
  hooksFormInitialState,
} from './hookFormReducer';

type ProjectEditViewProps = {
  match: {
    params: {
      projectId: string;
    };
  };
};

function removeHiddenKeysFromObject(subject: any) {
  return Object.keys(subject).forEach((key) => {
    if (key.indexOf('_') === 0) {
      // remove "hidden" keys from subjects
      delete subject[key];
    }
  });
}

function formatProjectForSaving(project: Project) {
  project = clonedeep(project);
  removeHiddenKeysFromObject(project);
  project?.hooks?.forEach((hook: Hook) => {
    removeHiddenKeysFromObject(hook);
  });
  return project;
}

export function ProjectEditView({
  match: {
    params: { projectId },
  },
}: ProjectEditViewProps) {
  const history = useHistory();
  const isNewProject = projectId === '--create-new-project--';

  useLayoutEffect(() => {
    navStructure([]);
  }, []);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [formState, dispatch] = useReducer(
    hookFormReducer,
    hooksFormInitialState
  );

  const { loading, error, data } = useGetProjectQuery({
    variables: {
      projectId: projectId,
    },
    onCompleted: (data) => {
      if (data?.project) {
        dispatch({
          type: 'SET_STATE',
          payload: data.project as HooksFormState,
        });
      }
    },
  });

  const [startCreateProjectMutation] = useCreateProjectMutation();
  const [startUpdateProjectMutation] = useUpdateProjectMutation();

  function updateProject() {
    setUpdating(true);
    const project = formatProjectForSaving(formState);
    startUpdateProjectMutation({
      variables: {
        project,
      },
    })
      .then((result) => {
        if (result.errors) {
          setUpdateError(result.errors[0].message);
        } else {
          history.push(`/${result.data?.updateProject.projectId}/runs`);
        }
      })
      .catch((error) => {
        setUpdateError(error.toString());
      })
      .finally(() => {
        setUpdating(false);
      });
  }

  function createProject() {
    setCreating(true);
    const project = formatProjectForSaving(formState);
    startCreateProjectMutation({
      variables: {
        project,
      },
    })
      .then((result) => {
        if (result.errors) {
          setCreateError(result.errors[0].message);
        } else {
          history.push(`/${result.data?.createProject.projectId}/runs`);
        }
      })
      .catch((error) => {
        setCreateError(error.toString());
      })
      .finally(() => {
        setCreating(false);
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
    e.preventDefault();
    if (isNewProject) {
      createProject();
    } else {
      updateProject();
    }
  };

  function createNewHook() {
    dispatch({
      type: 'ADD_NEW_HOOK',
    });
  }

  const disabled = creating || updating || loading;
  return (
    <form onSubmit={handleSubmit}>
      {createError || updateError ? (
        <div>{createError || updateError}</div>
      ) : null}
      <Grid wrap alignItems="center">
        <Cell xs={8}>
          <TextField
            name="projectId"
            label="Project Id"
            placeholder='Enter your "projectId"'
            value={formState.projectId}
            onChange={(e) =>
              dispatch({
                type: 'SET_PROJECT_NAME',
                payload: {
                  name: e.target.value,
                },
              })
            }
            disabled={!isNewProject || disabled}
            required
          />
        </Cell>
        <Cell alignSelf="flex-end">
          <Tooltip text='This must match the "projectId" value in your cypress.json configuration.'>
            <Icon icon="infoCircleOutline" />
          </Tooltip>
        </Cell>
      </Grid>
      <Grid wrap>
        <Cell xs={8}>
          <Table style={{ marginTop: '20px' }}>
            <TableHead>
              <TableRow>
                <TableHeader>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ fontWeight: 100 }}>Hooks</div>
                    <Button size="small" skin="ghost" onClick={createNewHook}>
                      <Icon
                        icon="plus"
                        size={1.3}
                        style={{ marginRight: '5px' }}
                      />
                      <span style={{ fontWeight: 100 }}>Add Hook</span>
                    </Button>
                  </div>
                </TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {formState.hooks?.map((hook: Hook) => (
                <HookEdit
                  hook={hook}
                  key={hook.hookId}
                  dispatch={dispatch}
                  disabled={disabled}
                />
              ))}
            </TableBody>
          </Table>
        </Cell>
      </Grid>

      <div style={{ marginTop: '32px' }}>
        <Button
          style={{ marginRight: '15px' }}
          component="a"
          href="/"
          disabled={creating || updating}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          kind="primary"
          disabled={creating || updating || loading}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
