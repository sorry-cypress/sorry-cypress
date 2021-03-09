import { GenericHook as GenericHookType } from '@sorry-cypress/common';
import { InputFieldLabel } from '@src/components';
import { Cell, Grid, TextField } from 'bold-ui';
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
    <Grid>
      <Cell xs={12}>
        <InputFieldLabel
          label="URL"
          htmlFor="url"
          required
          helpText="This url must be resolvable from the sever where sorry-cypress is running."
        >
          <TextField
            name="url"
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
          />
        </InputFieldLabel>
      </Cell>
      <Cell xs={12}>
        <InputFieldLabel
          label="Headers (optional)"
          htmlFor="headers"
          helpText='You can use this to pass a basic auth token or any other headers needed by your API. This must be structured as JSON, e.g.: {"X-api-key":"tough-key"}'
        >
          <TextField
            name="headers"
            placeholder="Enter a strinified JSON object with key values for POST call headers"
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
        </InputFieldLabel>
      </Cell>

      <EditHookEvents dispatch={dispatch} hook={hook} disabled={disabled} />
    </Grid>
  );
};
