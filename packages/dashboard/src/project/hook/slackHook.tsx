import {
  HookEvent,
  ResultFilter,
  SlackHook as SlackHookType,
} from '@sorry-cypress/common';
import { InputFieldLabel } from '@sorry-cypress/dashboard/components';
import {
  UpdateSlackHookInput,
  useUpdateSlackHookMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import { enumToString } from '@sorry-cypress/dashboard/project/hook/hook.utils';
import { Button, Cell, Grid, Select, TextField } from 'bold-ui';
import { isEqual } from 'lodash';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { EditBranchFilter } from './editBranchFilter';
import { EditHookEvents } from './editHookEvents';
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
        <Grid wrap={true}>
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
          <Cell xs={12}>
            <InputFieldLabel
              helpText="You can specify when a webhook should be triggered: only for failed builds, only for successful builds or for all builds."
              label={<span>Result Filter</span>}
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
                    itemIsEqual={isEqual}
                    itemToString={enumToString}
                    items={Object.keys(ResultFilter)}
                    name={name}
                    inputRef={ref}
                    onChange={(events: HookEvent[]) => onChange(events)}
                    value={value}
                    clearable={false}
                    disabled={loading}
                  />
                )}
              />
            </InputFieldLabel>
          </Cell>
          <EditBranchFilter hook={hook} disabled={loading} />
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
