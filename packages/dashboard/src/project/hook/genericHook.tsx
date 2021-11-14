import { Button, Grid, TextField } from '@mui/material';
import { GenericHook as GenericHookType } from '@sorry-cypress/common';
import { InputFieldLabel } from '@sorry-cypress/dashboard/components';
import {
  UpdateGenericHookInput,
  useUpdateGenericHookMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { EditHookEvents } from './editHookEvents';
import { useCurrentProjectId } from './useCurrentProjectId';
import { httpUrlValidation, jsonValidation } from './validation';

interface GenericHookProps {
  hook: GenericHookType;
}
export const GenericHook = ({ hook }: GenericHookProps) => {
  const projectId = useCurrentProjectId();
  const formMethods = useForm({
    mode: 'onChange',
  });

  const { register, handleSubmit, errors } = formMethods;

  const [updateGenericHook, { loading }] = useUpdateGenericHookMutation();

  async function onSubmit(input: UpdateGenericHookInput) {
    try {
      await updateGenericHook({
        variables: {
          input: { ...input, hookId: hook.hookId, projectId },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
  const hasErrors = Object.keys(errors).length > 0;
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid>
          <Grid item xs={12}>
            <InputFieldLabel
              label="URL"
              htmlFor="url"
              required
              helpText="This URL must be resolvable from sorry-cypress server"
              errorMessage={errors['url']?.message}
            >
              <TextField
                name="url"
                placeholder="Enter the server url for POST calls"
                defaultValue={hook.url}
                inputRef={register({
                  required: {
                    value: true,
                    message: 'Webhook URL is required',
                  },
                  validate: {
                    httpUrlValidation,
                  },
                })}
                disabled={loading}
                size="small"
              />
            </InputFieldLabel>
          </Grid>
          <Grid item xs={12}>
            <InputFieldLabel
              label="Headers"
              htmlFor="headers"
              helpText='You can use this to pass a basic auth token or any other headers needed by your API. This must be structured as JSON, e.g.: {"X-api-key":"tough-key"}'
              errorMessage={errors['headers']?.message}
            >
              <TextField
                name="headers"
                inputRef={register({
                  validate: {
                    jsonValidation,
                  },
                })}
                placeholder="Enter a stringified JSON object with key values for POST call headers"
                defaultValue={hook.headers}
                disabled={loading}
                size="small"
              />
            </InputFieldLabel>
          </Grid>

          <EditHookEvents hook={hook} disabled={loading} />

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={hasErrors || loading}
              type="submit"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};
