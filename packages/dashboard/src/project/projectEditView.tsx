import { InputFieldLabel } from '@src/components';
import {
  CreateProjectInput,
  UpdateProjectInput,
  useCreateProjectMutation,
  useGetProjectQuery,
  useUpdateProjectMutation,
} from '@src/generated/graphql';
import { setNav } from '@src/lib/navigation';
import { Alert, Button, Cell, Grid, Text, TextField } from 'bold-ui';
import React, { useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useHooksFormReducer, WithHooksForm } from './hook/hookFormReducer';
import { useCurrentProjectId } from './hook/useCurrentProjectId';
import { HooksEditor } from './hooksEditor';

export function ProjectEditView() {
  return (
    <WithHooksForm>
      <_ProjectEditView />
    </WithHooksForm>
  );
}
function _ProjectEditView() {
  const projectId = useCurrentProjectId();
  const {
    register,
    handleSubmit,
    errors,
    reset,
    formState: { isDirty },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      projectId: '',
      inactivityTimeoutSeconds: 180,
    },
  });
  const history = useHistory();
  const isNewProject = projectId === '--create-new-project--';
  const [_, dispatch] = useHooksFormReducer();

  useLayoutEffect(() => {
    setNav([]);
  }, []);

  const [notification, setNotification] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);

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
          hooks: data.project.hooks,
        },
      });
      reset({
        projectId: decodeURIComponent(data?.project.projectId),
        inactivityTimeoutSeconds: data?.project.inactivityTimeoutSeconds ?? 180,
      });
    },
  });

  async function updateProject(input: UpdateProjectInput) {
    try {
      const result = await startUpdateProjectMutation({
        variables: {
          input: { ...input, projectId },
        },
      });
      if (result.errors) {
        setOperationError(result.errors[0].message);
      } else {
        setNotification('Project Saved!');
      }
    } catch (error) {
      setOperationError(error.toString());
    }
  }

  async function createProject(project: CreateProjectInput) {
    try {
      const result = await startCreateProjectMutation({
        variables: {
          project,
        },
      });

      if (result.errors) {
        return setOperationError(result.errors[0].message);
      }
      if (!result.data?.createProject) {
        return setOperationError('No project returned');
      }

      setNotification('Project Created!');
      history.push(`/${result.data?.createProject.projectId}/edit`);
    } catch (error) {
      setOperationError(error.toString());
    }
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

  const onSubmit = (data: CreateProjectInput | UpdateProjectInput) => {
    data.inactivityTimeoutSeconds = data.inactivityTimeoutSeconds || 180;
    if (isNewProject) {
      createProject(data as CreateProjectInput);
    } else {
      updateProject(data as UpdateProjectInput);
    }
  };

  const disabled = creating || updating || loading;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid wrap>
          <Cell xs={12}>
            {operationError ? (
              <Alert type="danger" onCloseClick={() => setOperationError(null)}>
                {operationError}
              </Alert>
            ) : null}
            {notification && (
              <Alert type="success" onCloseClick={() => setNotification(null)}>
                {notification}
              </Alert>
            )}
          </Cell>
          <Cell xs={12}>
            <Text variant="h2">Project Settings</Text>
          </Cell>
          <Cell xs={12} sm={6}>
            <InputFieldLabel
              required
              htmlFor="projectId"
              label="Project Id"
              helpText="This must match the 'projectId' value in your cypress.json configuration."
              error={errors['projectId']?.message}
            >
              <TextField
                inputRef={register({
                  required: {
                    value: true,
                    message: 'Project id is required',
                  },
                })}
                name="projectId"
                placeholder='Enter your "projectId"'
                disabled={!isNewProject || disabled}
              />
            </InputFieldLabel>
          </Cell>
          <Cell xs={12} sm={6}>
            <InputFieldLabel
              htmlFor="inactivityTimeoutSeconds"
              label="Inactivity Timeout (seconds)"
              helpText="If any test runs longer than this value, the whole run will be considered as timed out"
              required
              error={errors['inactivityTimeoutSeconds']?.message}
            >
              <TextField
                name="inactivityTimeoutSeconds"
                placeholder="Inactivity timeout in seconds"
                type="number"
                inputRef={register({
                  valueAsNumber: true,
                  required: {
                    value: true,
                    message: 'Inactivity timeout is required',
                  },
                  max: {
                    value: 900,
                    message: 'Max value is 900 seconds',
                  },
                  min: {
                    value: 0,
                    message: 'Min value is 0 seconds',
                  },
                })}
                disabled={disabled}
              />
            </InputFieldLabel>
          </Cell>

          {(isDirty || isNewProject) && (
            <Cell>
              <Button style={{ marginRight: '15px' }} component="a" href="/">
                Cancel
              </Button>
              <Button
                type="submit"
                kind="primary"
                disabled={disabled || hasErrors}
              >
                {isNewProject ? 'Create Project' : 'Save Settings'}
              </Button>
            </Cell>
          )}
        </Grid>
      </form>

      {!isNewProject && <HooksEditor />}
    </>
  );
}
