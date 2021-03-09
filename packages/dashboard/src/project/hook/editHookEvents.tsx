import { HookEvent, HookWithCustomEvents } from '@sorry-cypress/common';
import { InputFieldLabel } from '@src/components';
import { Cell, Select } from 'bold-ui';
import { isEqual } from 'lodash';
import React from 'react';
import { hookTypeToString } from './hook.utils';
import { HookFormAction } from './hookFormReducer';

interface EditHookEventsProps {
  hook: HookWithCustomEvents;
  dispatch: React.Dispatch<HookFormAction>;
  disabled: boolean;
}
export const EditHookEvents = ({
  dispatch,
  hook,
  disabled,
}: EditHookEventsProps) => (
  <Cell xs={12}>
    <InputFieldLabel
      label="Hook Events"
      helpText="These are the events that will trigger an XHR POST call to the provided URL. Leaving this field blank has the same effect as selecting all hook events."
    >
      <Select
        itemIsEqual={isEqual}
        itemToString={hookTypeToString}
        multiple={true}
        items={Object.keys(HookEvent)}
        name="hookEvents"
        disabled={disabled}
        onChange={(events: HookEvent[]) => {
          dispatch({
            type: 'SET_HOOK_FIELD',
            payload: {
              hookId: hook.hookId,
              data: {
                hookEvents: events,
              },
            },
          });
        }}
        value={hook.hookEvents}
      />
    </InputFieldLabel>
  </Cell>
);
