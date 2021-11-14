import {
  Button,
  Grid,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import {
  ResultFilter,
  SlackHook as SlackHookType,
} from '@sorry-cypress/common';
import { InputFieldLabel } from '@sorry-cypress/dashboard/components';
import {
  UpdateSlackHookInput,
  useUpdateSlackHookMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { EditBranchFilter } from './editBranchFilter';
import { EditHookEvents } from './editHookEvents';
import { enumToString } from './hook.utils';
import { useCurrentProjectId } from './useCurrentProjectId';
import { httpUrlValidation, slackResultValidation } from './validation';

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
        <Grid container>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <InputFieldLabel
              helpText="You can specify when a webhook should be triggered: only for failed builds, only for successful builds or for all builds."
              label="Result Filter"
              error={errors['slackResultFilter']?.message}
              htmlFor="slackResultFilter"
              required
            >
              <Controller
                name="slackResultFilter"
                defaultValue={hook.slackResultFilter}
                rules={{
                  required: {
                    value: true,
                    message: 'Event Filter is required',
                  },
                  validate: {
                    slackResultValidation,
                  },
                }}
                render={({ name, value, onChange, ref }) => (
                  <Select
                    name={name}
                    inputRef={ref}
                    onChange={(e) => onChange(e.target.value)}
                    value={value}
                    disabled={loading}
                    size="small"
                  >
                    {Object.keys(ResultFilter)
                      .sort()
                      .map((filter) => (
                        <MenuItem key={filter} value={filter}>
                          <ListItemText primary={enumToString(filter)} />
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </InputFieldLabel>
          </Grid>
          <EditBranchFilter hook={hook} disabled={loading} />
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
