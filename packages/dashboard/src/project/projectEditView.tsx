import { Hook } from '@sorry-cypress/common';
import { InputFieldLabel } from '@src/components';
import {
  ProjectInput,
  useCreateProjectMutation,
  useGetProjectQuery,
  useUpdateProjectMutation,
} from '@src/generated/graphql';
import { setNav } from '@src/lib/navigation';
import {
  Button,
  Cell,
  Grid,
  HFlow,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Text,
  TextField,
} from 'bold-ui';
import React, { useLayoutEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { HookEdit } from './hook/hookEdit';
import {
  hookFormReducer,
  hooksFormInitialState,
  HooksFormState,
} from './hook/hookFormReducer';

export function ProjectEditView({
  match: {
    params: { projectId },
  },
}: ProjectEditViewProps) {
  const history = useHistory();
  const isNewProject = projectId === '--create-new-project--';

  useLayoutEffect(() => {
    setNav([]);
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
          // history.push(`/${result.data?.updateProject.projectId}/runs`);
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
      <Grid wrap>
        <Cell xs={12} sm={6}>
          <InputFieldLabel
            required
            htmlFor="projectId"
            label="Project Id"
            helpText="This must match the 'projectId' value in your cypress.json configuration."
          >
            <TextField
              name="projectId"
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
            />
          </InputFieldLabel>
        </Cell>
        <Cell xs={12} sm={6}>
          <InputFieldLabel
            htmlFor="inactivityTimeoutSeconds"
            label="Inactivity Timeout (seconds)"
            helpText="If any test runs longer than this value, the whole run will be considered as timed out"
          >
            <TextField
              name="inactivityTimeoutSeconds"
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
          </InputFieldLabel>
        </Cell>
        <Cell xs={12}>
          <HFlow alignItems="center" justifyContent="space-between">
            <div>Hooks</div>
            <Button size="small" skin="ghost" onClick={createNewHook}>
              <Icon icon="plus" size={1.3} style={{ marginRight: '5px' }} />
              <span>Add Hook</span>
            </Button>
          </HFlow>
        </Cell>
        <Cell xs={12}>
          {!formState.hooks.length && <Text>No hooks defined</Text>}
          <Table>
            <TableBody>
              {formState.hooks?.map((hook: Hook) => (
                <TableRow key={hook.hookId}>
                  <TableCell>
                    <HookEdit
                      hook={hook}
                      dispatch={dispatch}
                      disabled={disabled}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Cell>
        <Cell>
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
        </Cell>
      </Grid>
    </form>
  );
}

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
