import { SlackHook as SlackHookType } from '@sorry-cypress/common';
import { InputFieldLabel } from '@src/components';
import { Cell, Grid, TextField } from 'bold-ui';
import React from 'react';
import { EditHookEvents } from './editHookEvents';
import { HookFormAction } from './hookFormReducer';

interface SlackHookProps {
  hook: SlackHookType;
  disabled: boolean;

  dispatch: React.Dispatch<HookFormAction>;
}
export const SlackHook = ({ hook, disabled, dispatch }: SlackHookProps) => (
  <Grid>
    <Cell xs={12}>
      <InputFieldLabel
        helpText="Incoming webhook URL. https://api.slack.com/messaging/webhooks"
        label={
          <span>
            Incoming webhook URL &nbsp;
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
        htmlFor="url"
      >
        <TextField
          name="url"
          placeholder="Enter your Incoming Webhook URL"
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
    <EditHookEvents dispatch={dispatch} hook={hook} disabled={disabled} />
  </Grid>
);
