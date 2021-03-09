import { BitBucketHook as BitbucketHookType } from '@sorry-cypress/common';
import { InputFieldLabel } from '@src/components';
import { useSwitch } from '@src/hooks/useSwitch';
import { Cell, Grid, TextField } from 'bold-ui';
import React from 'react';
import { HookFormAction } from './hookFormReducer';

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
    <Grid>
      <Cell xs={12}>
        <InputFieldLabel
          label="URL"
          htmlFor="url"
          required
          helpText="This is the Bitbucket repository URL, e.g. https://bitbucket.org/sorry-cypress/sorry-cypress"
        >
          <TextField
            name="url"
            clearable
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
          />
        </InputFieldLabel>
      </Cell>

      <Cell xs={12}>
        <InputFieldLabel
          required={isNewHook}
          label="Bitbucket&nbsp;Username"
          htmlFor="bitbucketUser"
        >
          <TextField
            name="bitbucketUser"
            placeholder={'Enter Bitbucket username'}
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
          />
        </InputFieldLabel>
      </Cell>

      <Cell xs={12}>
        <InputFieldLabel
          required={isNewHook}
          label={
            <span>
              Bitbucket&nbsp;App&nbsp;Password&nbsp;
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://bitbucket.org/account/settings/app-passwords/"
              >
                (Create One)
              </a>
            </span>
          }
          htmlFor="bitbucketToken"
          helpText="You will need to generate this token on bitbucket. Once this token is saved you will not be able to see it again. You will alwayse be able to update it."
        >
          <TextField
            autoComplete="off"
            icon={showToken ? 'eyeFilled' : 'eyeHiddenFilled'}
            onIconClick={() => toggleToken()}
            name="bitbucketToken"
            type={showToken ? 'text' : 'password'}
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
        </InputFieldLabel>
      </Cell>

      <Cell xs={12}>
        <InputFieldLabel
          label="Bitbucket Build Name"
          htmlFor="bitbucketBuildName"
          helpText='This string will be used as a build name in Bitbucket. Default value is "sorry-cypress".'
        >
          <TextField
            name="bitbucketBuildName"
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
        </InputFieldLabel>
      </Cell>
    </Grid>
  );
};
