import { GithubHook as GithubHookType } from '@sorry-cypress/common';
import { InputFieldLabel } from '@src/components';
import { useSwitch } from '@src/hooks/useSwitch';
import { Cell, Grid, TextField } from 'bold-ui';
import React from 'react';
import { HookFormAction } from './hookFormReducer';

interface GithubHookPros {
  hook: GithubHookType;
  disabled: boolean;
  dispatch: React.Dispatch<HookFormAction>;
}
export const GithubHook = ({ hook, disabled, dispatch }: GithubHookPros) => {
  const isNewHook = !hook.hookId;
  const [showToken, toggleToken] = useSwitch();

  return (
    <Grid>
      <Cell xs={12}>
        <InputFieldLabel
          helpText="This is the GitHub repository URL, e.g. https://github.com/sorry-cypress/sorry-cypress"
          label="URL"
          htmlFor="url"
          required
        >
          <TextField
            name="url"
            placeholder="Enter your GitHub repo URL"
            value={hook.url}
            onChange={(e) => {
              dispatch({
                type: 'SET_HOOK_FIELD',
                payload: {
                  hookId: hook.hookId,
                  data: {
                    url: e.target.value,
                  },
                },
              });
            }}
            disabled={disabled}
          />
        </InputFieldLabel>
      </Cell>
      <Cell xs={12}>
        <InputFieldLabel
          helpText="Your private GriHub token. Once this token is saved you will not be able to see it again. You will alwayse be able to update it."
          label={
            <span>
              Github Token &nbsp;
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
          required={isNewHook}
        >
          <TextField
            autoComplete="off"
            icon={showToken ? 'eyeFilled' : 'eyeHiddenFilled'}
            onIconClick={() => toggleToken()}
            name="githubToken"
            type={showToken ? 'text' : 'password'}
            placeholder={
              isNewHook
                ? 'Enter a github token with repo:status access.'
                : 'Using a previously saved token. You may enter a new one.'
            }
            value={hook.githubToken}
            onChange={(e) =>
              dispatch({
                type: 'SET_HOOK_FIELD',
                payload: {
                  hookId: hook.hookId,
                  data: {
                    githubToken: e.target.value.trim(),
                  },
                },
              })
            }
            disabled={disabled}
          />
        </InputFieldLabel>
      </Cell>
      <Cell xs={12}>
        <InputFieldLabel
          helpText='Status label in GitHub to differentiate this project status from others. Default value is "Sorry-Cypress-Tests"'
          label="Status Label"
          htmlFor="githubContext"
        >
          <TextField
            name="githubContext"
            placeholder="Enter custom string to differentiate this status from others"
            value={hook.githubContext}
            onChange={(e) =>
              dispatch({
                type: 'SET_HOOK_FIELD',
                payload: {
                  hookId: hook.hookId,
                  data: {
                    githubContext: e.target.value.trim(),
                  },
                },
              })
            }
            disabled={disabled}
          />
        </InputFieldLabel>
      </Cell>
    </Grid>
  );
};
