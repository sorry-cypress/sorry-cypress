import {
  TeamsHook as TeamsHookType,
} from '@sorry-cypress/common';
import { InputFieldLabel } from '@sorry-cypress/dashboard/components';
import { EditHookEvents } from './editHookEvents';
import { useCurrentProjectId } from './useCurrentProjectId';
import { FormProvider, useForm } from 'react-hook-form';
import {
  UpdateTeamsHookInput,
  useUpdateTeamsHookMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import { Button, Cell, Grid, TextField } from 'bold-ui';
import React from 'react';
import { httpUrlValidation } from './validation';

interface TeamsHookProps {
  hook: TeamsHookType;
}

export const TeamsHook = ({ hook }: TeamsHookProps) => {
  const projectId = useCurrentProjectId();
  const formMethods = useForm({
    mode: 'onChange',
  });

  const { register, handleSubmit, errors } = formMethods;

  const [updateGenericHook, { loading }] = useUpdateTeamsHookMutation();

  async function onSubmit(input: UpdateTeamsHookInput) {
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
        <Grid wrap={true}>
          <Cell xs={12}>
            <InputFieldLabel
              helpText="Incoming Webhook URL, e.g. https://1234.webhook.office.com/..."
              label={
                <span>
                  Incoming webhook URL&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook#create-incoming-webhook-1"
                  >
                    (Guide)
                  </a>
                </span>
              }
              required
              error={errors['url']?.message}
              htmlFor="url"
            >
              <TextField
                name="url"
                placeholder="Enter your Incoming Webhook URL"
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
