import { GenericHook as GenericHookType } from '@sorry-cypress/common';
import { InputFieldLabel } from '@sorry-cypress/dashboard/components';
import {
  UpdateGenericHookInput,
  useUpdateGenericHookMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import { Button, Cell, Grid, TextField } from 'bold-ui';
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
          <Cell xs={12}>
            <InputFieldLabel
              label="URL"
              htmlFor="url"
              required
              helpText="This URL must be resolvable from sorry-cypress server"
              error={errors['url']?.message}
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
              />
            </InputFieldLabel>
          </Cell>
          <Cell xs={12}>
            <InputFieldLabel
              label="Headers"
              htmlFor="headers"
              helpText='You can use this to pass a basic auth token or any other headers needed by your API. This must be structured as JSON, e.g.: {"X-api-key":"tough-key"}'
              error={errors['headers']?.message}
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
              />
            </InputFieldLabel>
          </Cell>

          <EditHookEvents hook={hook} disabled={loading} />

          <Cell>
            <Button
              kind="primary"
              size="small"
              loading={loading}
              disabled={hasErrors}
              type="submit"
            >
              Save
            </Button>
          </Cell>
        </Grid>
      </form>
    </FormProvider>
  );
};
