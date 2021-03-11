import { SlackHook as SlackHookType } from '@sorry-cypress/common';
import { InputFieldLabel } from '@src/components';
import {
  UpdateSlackHookInput,
  useUpdateSlackHookMutation,
} from '@src/generated/graphql';
import { Button, Cell, Grid, TextField } from 'bold-ui';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { EditHookEvents } from './editHookEvents';
import { useCurrentProjectId } from './useCurrentProjectId';
import { httpUrlValidation } from './validation';

interface SlackHookProps {
  hook: SlackHookType;
}
export const SlackHook = ({ hook }: SlackHookProps) => {
  const projectId = useCurrentProjectId();
  const formMethods = useForm({
    mode: 'onChange',
  });

  const { register, handleSubmit, errors } = formMethods;

  const [updateGenericHook, { loading }] = useUpdateSlackHookMutation();

  async function onSubmit(input: UpdateSlackHookInput) {
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
              helpText="Incoming Webhook URL, e.g. https://hooks.slack.com/services/XXX/YYY/ZZZ"
              label={
                <span>
                  Incoming webhook URL&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://api.slack.com/messaging/webhooks"
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
