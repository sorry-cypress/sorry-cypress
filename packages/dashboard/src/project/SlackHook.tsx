import React from 'react';
import { SlackHook as SlackHookType } from '@sorry-cypress/common';
import { Icon, Tooltip, TextField } from 'bold-ui';
import { HookFormAction } from './hookFormReducer';
import { EditHookEvents } from './EditHookEvents';

interface SlackHookProps {
  hook: SlackHookType;
  disabled: boolean;

  dispatch: React.Dispatch<HookFormAction>;
}
export const SlackHook = ({ hook, disabled, dispatch }: SlackHookProps) => (
  <>
    <div
      style={{
        marginBottom: '20px',
        position: 'relative',
      }}
    >
      <TextField
        name="url"
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
        required
      />
      <div
        style={{
          position: 'absolute',
          right: '-71px',
          top: '29px',
        }}
      >
        <Tooltip text="Incoming webhook URL. https://api.slack.com/messaging/webhooks">
          <Icon icon="infoCircleOutline" />
        </Tooltip>
      </div>
    </div>
    <EditHookEvents dispatch={dispatch} hook={hook} disabled={disabled} />
  </>
);
