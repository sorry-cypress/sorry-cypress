import React from 'react';

import { Icon, Tooltip, TextField } from 'bold-ui';
import { BitBucketHook as BitbucketHookType } from '@src/duplicatedFromDirector/project.types';
import { HookFormAction } from './hookFormReducer';
import { useSwitch } from '@src/hooks/useSwitch';

interface BitbucketHookPros {
  hook: BitbucketHookType;
  disabled: boolean;
  dispatch: React.Dispatch<HookFormAction>;
}
export const BitbucketHook = ({
  hook,
  disabled,
  dispatch,
}: BitbucketHookPros) => {
  const isNewHook = !hook.hookId;
  const [showToken, toggleToken] = useSwitch();

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
          placeholder="Enter your Bitbucket repo URL"
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
          <Tooltip text="This is the Bitbucket repository URL, e.g. https://bitbucket.org/sorry-cypress/sorry-cypress">
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
          autoComplete="off"
          icon={showToken ? 'eyeFilled' : 'eyeHiddenFilled'}
          onIconClick={() => toggleToken()}
          name="bitbucketUsername"
          label={<span>Bitbucket Username &nbsp;</span>}
          placeholder={
            isNewHook
              ? 'Enter a bitbucket Username token with repo:status write access.'
              : 'Using a previously saved token. You may enter a new one.'
          }
          value={hook.bitbucketUsername}
          onChange={(e) =>
            dispatch({
              type: 'SET_HOOK_FIELD',
              payload: {
                hookId: hook.hookId,
                data: {
                  bitbucketUsername: e.target.value.trim(),
                },
              },
            })
          }
          disabled={disabled}
          required={isNewHook}
        />
        <TextField
          autoComplete="off"
          icon={showToken ? 'eyeFilled' : 'eyeHiddenFilled'}
          onIconClick={() => toggleToken()}
          name="bitbucketToken"
          type={showToken ? 'text' : 'password'}
          label={
            <span>
              Bitbucket Token &nbsp;
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html"
              >
                (Create One)
              </a>
            </span>
          }
          placeholder={
            isNewHook
              ? 'Enter a bitbucket Personal token with repo:status write access.'
              : 'Using a previously saved token. You may enter a new one.'
          }
          value={hook.bitbucketToken}
          onChange={(e) =>
            dispatch({
              type: 'SET_HOOK_FIELD',
              payload: {
                hookId: hook.hookId,
                data: {
                  bitbucketToken: e.target.value.trim(),
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
          <Tooltip text="You will need to generate this token on bitbucket. Once this token is saved you will not be able to see it again. You will alwayse be able to update it.">
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
          name="bitbucketBuildName"
          label="BitBucket Context"
          placeholder="Enter custom string to differentiate this status from others"
          value={hook.bitbucketBuildName}
          onChange={(e) =>
            dispatch({
              type: 'SET_HOOK_FIELD',
              payload: {
                hookId: hook.hookId,
                data: {
                  bitbucketBuildName: e.target.value.trim(),
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
