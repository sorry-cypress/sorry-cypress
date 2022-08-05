import { Button, Grid, TextField } from '@mui/material';
import { GChatHook as GChatHookType } from '@sorry-cypress/common';
import { InputFieldLabel } from '@sorry-cypress/dashboard/components';
import {
  UpdateGChatHookInput,
  useUpdateGChatHookMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { EditHookEvents } from './editHookEvents';
import { useCurrentProjectId } from './useCurrentProjectId';
import { httpUrlValidation } from './validation';

interface GChatHookProps {
  hook: GChatHookType;
}

export const GChatHook = ({ hook }: GChatHookProps) => {
  const projectId = useCurrentProjectId();
  const formMethods = useForm({
    mode: 'onChange',
  });

  const { register, handleSubmit, errors } = formMethods;

  const [updateGenericHook, { loading }] = useUpdateGChatHookMutation();

  async function onSubmit(input: UpdateGChatHookInput) {
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
        <Grid container>
          <Grid item xs={12}>
            <InputFieldLabel
              helpText="Incoming Webhook URL, e.g. https://chat.googleapis.com/v1/spaces/7D8la4AAAAE/messages?key/..."
              label={
                <span>
                  Incoming webhook URL&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://developers.google.com/chat/how-tos/webhooks"
                  >
                    (Guide)
                  </a>
                </span>
              }
              required
              errorMessage={errors['url']?.message}
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
