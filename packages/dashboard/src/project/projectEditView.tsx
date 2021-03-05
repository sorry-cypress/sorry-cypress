import { Hook } from '@sorry-cypress/common';
import {
  ProjectInput,
  useCreateProjectMutation,
  useGetProjectQuery,
  useUpdateProjectMutation,
} from '@src/generated/graphql';
import { navStructure } from '@src/lib/navigation';
import {
  Button,
  Cell,
  Grid,
  Icon,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TextField,
  Tooltip,
} from 'bold-ui';
import React, { useLayoutEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { HookEdit } from './hook/hookEdit';
import {
  hookFormReducer,
  hooksFormInitialState,
  HooksFormState,
} from './hook/hookFormReducer';

type ProjectEditViewProps = {
  match: {
    params: {
      projectId: string;
    };
  };
};

function formatProjectForSaving(formValues: HooksFormState): ProjectInput {
  return {
    ...formValues,
    projectId: encodeURIComponent(formValues.projectId),
    inactivityTimeoutSeconds: Number(formValues.inactivityTimeoutSeconds),
  };
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

  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [formState, dispatch] = useReducer(
    hookFormReducer,
    hooksFormInitialState
  );
  const [
    startCreateProjectMutation,
    { loading: creating },
  ] = useCreateProjectMutation();
  const [
    startUpdateProjectMutation,
    { loading: updating },
  ] = useUpdateProjectMutation();

  const { loading, error, data } = useGetProjectQuery({
    variables: {
      projectId: projectId,
    },
    onCompleted: (data) => {
      if (!data?.project) {
        return;
      }
      dispatch({
        type: 'SET_STATE',
        payload: {
          projectId: data.project.projectId,
          inactivityTimeoutSeconds: data.project.inactivityTimeoutSeconds
            ? data.project.inactivityTimeoutSeconds.toString()
            : '',
          hooks: (data.project.hooks as Hook[]) || [],
        },
      });
    },
  });

  function updateProject() {
    startUpdateProjectMutation({
      variables: {
        project: formatProjectForSaving(formState),
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
      });
  }

  function createProject() {
    startCreateProjectMutation({
      variables: {
        project: formatProjectForSaving(formState),
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
            value={decodeURIComponent(formState.projectId)}
            onChange={(e) =>
              dispatch({
                type: 'SET_PROJECT_NAME',
                payload: {
                  name: e.target.value.trim(),
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
        <Cell xs={8}>
          <TextField
            name="inactivityTimeoutSeconds"
            label="Inactivity Timeout (seconds)"
            placeholder="Inactivity timeout in seconds"
            type="number"
            value={formState.inactivityTimeoutSeconds}
            onChange={(e) =>
              dispatch({
                type: 'SET_PROJECT_INACTIVITY_TIMEOUT',
                payload: {
                  timeout: e.target.value.trim(),
                },
              })
            }
            disabled={disabled}
          />
        </Cell>
        <Cell alignSelf="flex-end">
          <Tooltip text="If any test runs longer than this value, the whole run will be considered as timed out">
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
          disabled={disabled}
        >
          Cancel
        </Button>
        <Button type="submit" kind="primary" disabled={disabled}>
          Save
        </Button>
      </div>
    </form>
  );
}
