import { GenericHook as GenericHookType } from '@sorry-cypress/common';
import { Icon, TextField, Tooltip } from 'bold-ui';
import React from 'react';
import { EditHookEvents } from './editHookEvents';
import { HookFormAction } from './hookFormReducer';

interface GenericHookProps {
  hook: GenericHookType;
  disabled: boolean;
  dispatch: React.Dispatch<HookFormAction>;
}
export const GenericHook = ({ hook, disabled, dispatch }: GenericHookProps) => {
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
          placeholder="Enter the server url for POST calls"
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
          <Tooltip text="This url must be resolvable from the sever where sorry-cypress running.">
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
          name="headers"
          label="Headers (optional)"
          placeholder="Enter a JSON object with key values for POST call headers"
          value={hook.headers || ''}
          onChange={(e) => {
            dispatch({
              type: 'SET_HOOK_FIELD',
              payload: {
                hookId: hook.hookId,
                data: {
                  headers: e.target.value,
                },
              },
            });
          }}
          disabled={disabled}
        />
        <div
          style={{
            position: 'absolute',
            right: '-71px',
            top: '29px',
          }}
        >
          <Tooltip text='You can use this to pass a basic auth token or any other headers needed by your api. This must be structured as JSON. ex: {"X-api-key":"tough-key"}'>
            <Icon icon="infoCircleOutline" />
          </Tooltip>
        </div>
      </div>
      <EditHookEvents dispatch={dispatch} hook={hook} disabled={disabled} />
    </>
  );
};
