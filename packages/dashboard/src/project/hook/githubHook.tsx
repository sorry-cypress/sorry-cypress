import { GithubHook as GithubHookType } from '@sorry-cypress/common';
import { InputFieldLabel } from '@sorry-cypress/dashboard/components';
import {
  UpdateGithubHookInput,
  useUpdateGithubHookMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useSwitch } from '@sorry-cypress/dashboard/hooks/useSwitch';
import { Button, Cell, Grid, Link, Text, TextField } from 'bold-ui';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useCurrentProjectId } from './useCurrentProjectId';
import { githubUrlValidation } from './validation';

interface GithubHookPros {
  hook: GithubHookType;
}
export const GithubHook = ({ hook }: GithubHookPros) => {
  const projectId = useCurrentProjectId();
  const [editToken, toggleEditToken] = useSwitch();
  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange',
  });

  const [showToken, toggleToken] = useSwitch();
  const [updateHook, { loading }] = useUpdateGithubHookMutation();
  async function onSubmit(input: UpdateGithubHookInput) {
    try {
      await updateHook({
        variables: {
          input: { ...input, hookId: hook.hookId, projectId },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
  const hasErrors = Object.keys(errors).length > 0;
  const disabled = loading;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <Cell xs={12}>
          <InputFieldLabel
            helpText="This is the GitHub repository URL, e.g. https://github.com/sorry-cypress/sorry-cypress"
            label="URL"
            htmlFor="url"
            error={errors['url']?.message}
            required
          >
            <TextField
              name="url"
              placeholder="e.g. https://github.com/sorry-cypress/sorry-cypress"
              inputRef={register({
                required: {
                  value: true,
                  message: 'Github repository URL is required',
                },

                validate: {
                  githubUrlValidation,
                },
              })}
              defaultValue={hook.url}
              disabled={disabled}
            />
          </InputFieldLabel>
        </Cell>
        <Cell xs={12}>
          <InputFieldLabel
            helpText="Your private GitHub token with repo:status permissions. Once this token is saved you will not be able to see it again. You will alwayse be able to update it."
            label={
              <span>
                Github Token&nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/settings/tokens/new?scopes=repo&description=Sorry-cypress-status"
                >
                  (Create One)
                </a>
              </span>
            }
            htmlFor="githubToken"
            error={errors['githubToken']?.message}
            required
          >
            {hook.githubToken && !editToken && (
              <>
                <Text>Using saved token</Text>{' '}
                <Link onClick={() => toggleEditToken(true)}>Edit</Link>
              </>
            )}
            {(!hook.githubToken || editToken) && (
              <TextField
                autoComplete="new-password"
                icon={showToken ? 'eyeFilled' : 'eyeHiddenFilled'}
                onIconClick={() => toggleToken()}
                name="githubToken"
                id="new-password"
                type={showToken ? 'text' : 'password'}
                placeholder="Enter Github token with repo:status access."
                inputRef={register({
                  required: {
                    value: true,
                    message: 'Github token is required',
                  },
                })}
                defaultValue={''}
                disabled={disabled}
              />
            )}
          </InputFieldLabel>
        </Cell>
        <Cell xs={12}>
          <InputFieldLabel
            helpText='Status label in GitHub to differentiate this project status from others. Default value is "Sorry-Cypress-Tests"'
            label="Status Label"
            htmlFor="githubContext"
            error={errors['githubContext']?.message}
          >
            <TextField
              name="githubContext"
              placeholder="Enter custom string to differentiate this status from others"
              defaultValue={hook.githubContext}
              inputRef={register}
              disabled={disabled}
            />
          </InputFieldLabel>
        </Cell>
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
  );
};
