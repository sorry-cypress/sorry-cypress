import { Alert, Button, Grid, TextField, Typography } from '@mui/material';
import { InputFieldLabel } from '@sorry-cypress/dashboard/components';
import {
  CreateProjectInput,
  UpdateProjectInput,
  useCreateProjectMutation,
  useGetProjectQuery,
  useUpdateProjectMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import React, { FunctionComponent, useState } from 'react';
import { CirclePicker } from 'react-color';
import { Controller, useForm } from 'react-hook-form';
import { client } from '../lib/apolloClient';
import { useHooksFormReducer } from './hook/hookFormReducer';

const DEFAULT_TIMEOUT_SECONDS = 600;

export const ProjectEditForm: ProjectEditFormComponent = function ProjectEditForm(
  props
) {
  const { projectId, isNewProject, onProjectCreated, singleRow } = props;
  const { control, register, handleSubmit, errors, reset } = useForm<
    ProjectFormFields
  >({
    mode: 'onChange',
    defaultValues: {
      projectId: '',
      inactivityTimeoutMinutes: DEFAULT_TIMEOUT_SECONDS / 60,
    },
  });
  const [_, dispatch] = useHooksFormReducer();

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
        inactivityTimeoutMinutes: Math.ceil(
          (data?.project.inactivityTimeoutSeconds ?? DEFAULT_TIMEOUT_SECONDS) /
            60
        ),
        projectColor: data?.project.projectColor || '',
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
    } catch (error: any) {
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
      onProjectCreated?.({ projectId: result.data?.createProject.projectId });
    } catch (error: any) {
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

  const onSubmit = (data: ProjectFormFields) => {
    if (isNewProject) {
      createProject({
        projectId: data.projectId,
        inactivityTimeoutSeconds:
          data.inactivityTimeoutMinutes * 60 ?? DEFAULT_TIMEOUT_SECONDS,
        projectColor: data?.projectColor,
      });
    } else {
      updateProject({
        projectId: data.projectId,
        inactivityTimeoutSeconds:
          data.inactivityTimeoutMinutes * 60 ?? DEFAULT_TIMEOUT_SECONDS,
        projectColor: data?.projectColor,
      });
    }
    client.reFetchObservableQueries();
  };

  const disabled = creating || updating || loading;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {operationError ? (
            <Alert severity="error" onClose={() => setOperationError(null)}>
              {operationError}
            </Alert>
          ) : null}
          {notification && (
            <Alert severity="success" onClose={() => setNotification(null)}>
              {notification}
            </Alert>
          )}
        </Grid>
        <Grid item xs={12} sm={singleRow ? 12 : 6}>
          <InputFieldLabel
            required
            htmlFor="projectId"
            label="Project Id"
            helpText="This is the 'projectId' value from cypress.json"
            errorMessage={errors['projectId']?.message}
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
              size="small"
            />
          </InputFieldLabel>
        </Grid>
        <Grid item xs={12} sm={singleRow ? 12 : 6}>
          <InputFieldLabel
            htmlFor="inactivityTimeoutMinutes"
            label="Runs Timeout (minutes)"
            helpText="Runs exceeding this value will be considered as timed out"
            required
            errorMessage={errors['inactivityTimeoutMinutes']?.message}
          >
            <TextField
              name="inactivityTimeoutMinutes"
              placeholder="Runs timeout in minutes"
              type="number"
              inputRef={register({
                valueAsNumber: true,
                required: {
                  value: true,
                  message: 'Runs timeout is required',
                },
                max: {
                  value: 720,
                  message: 'Max value is 720 minutes (12 hours)',
                },
                min: {
                  value: 1,
                  message: 'Min value is 1 minute',
                },
              })}
              disabled={disabled}
              size="small"
            />
          </InputFieldLabel>
        </Grid>
        <Grid item xs={12}>
          <InputFieldLabel
            htmlFor="projectColor"
            label="Project Color"
            helpText="A color to easily differentiate this project from others"
            errorMessage={errors['projectColor']?.message}
          >
            <Controller
              control={control}
              render={({ onChange, value }) => (
                <CirclePicker
                  circleSize={20}
                  color={value}
                  onChange={(color) => onChange(color.hex)}
                  width="100%"
                />
              )}
              name="projectColor"
              defaultValue=""
            />
            {errors.projectColor && (
              <Typography>{errors.projectColor}</Typography>
            )}
          </InputFieldLabel>
        </Grid>
        <Grid item container xs={12} justifyContent="flex-end">
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={disabled || hasErrors}
          >
            {isNewProject ? 'Create Project' : 'Save Settings'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

type ProjectFormFields = {
  projectId: string;
  inactivityTimeoutMinutes: number;
  projectColor: string;
};

type ProjectEditFormProps = {
  projectId: string;
  isNewProject: boolean;
  onProjectCreated: ({ projectId }: { projectId: string }) => void;
  singleRow?: boolean;
};
type ProjectEditFormComponent = FunctionComponent<ProjectEditFormProps>;
