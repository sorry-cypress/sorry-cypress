import React from 'react';

import { Icon, Tooltip, TextField } from 'bold-ui';
import { GithubHook as GithubHookType } from '@src/duplicatedFromDirector/project.types';
import { HookFormAction } from './hookFormReducer';

interface GithubHookPros {
  hook: GithubHookType;
  disabled: boolean;
  dispatch: React.Dispatch<HookFormAction>;
}
export const GithubHook = ({ hook, disabled, dispatch }: GithubHookPros) => {
  const isNewHook = !hook.hookId;

  return (
    <>
      <div
        style={{
          marginBottom: '20px',
          position: 'relative',
        }}
      >
        <TextField
          name="url"
          label="URL"
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
          required
        />
        <div
          style={{
            position: 'absolute',
            right: '-71px',
            top: '29px',
          }}
        >
          <Tooltip text="This is the GitHub repository URL, e.g. https://github.com/sorry-cypress/sorry-cypress">
            <Icon icon="infoCircleOutline" />
          </Tooltip>
        </div>
      </div>
      <div
        style={{
          marginBottom: '32px',
          position: 'relative',
        }}
      >
        <TextField
          name="githubToken"
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
          required={isNewHook}
        />
        <div
          style={{
            position: 'absolute',
            right: '-71px',
            top: '29px',
          }}
        >
          <Tooltip text="You will need to generate this token on github. Once this token is saved you will not be able to see it again. You will alwayse be able to update it.">
            <Icon icon="infoCircleOutline" />
          </Tooltip>
        </div>
      </div>
      <div
        style={{
          marginBottom: '20px',
          position: 'relative',
        }}
      >
        <TextField
          name="githubContext"
          label="Github Context"
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
        <div
          style={{
            position: 'absolute',
            right: '-71px',
            top: '29px',
          }}
        >
          <Tooltip text='This string will be used as a status name in Github to differentiate this project status from others. Default value is "Sorry-Cypress-Tests".'>
            <Icon icon="infoCircleOutline" />
          </Tooltip>
        </div>
      </div>
    </>
  );
};
