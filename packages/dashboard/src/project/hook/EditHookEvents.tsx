import { GithubHook, Hook, HookEvent, hookEvents } from '@sorry-cypress/common';
import { Icon, Select, Tooltip } from 'bold-ui';
import { isEqual } from 'lodash';
import React from 'react';
import { hookTypeToString } from './hook.utils';
import { HookFormAction } from './hookFormReducer';

interface EditHookEventsProps {
  hook: Exclude<Hook, GithubHook>;
  dispatch: React.Dispatch<HookFormAction>;
  disabled: boolean;
}
export const EditHookEvents = ({
  dispatch,
  hook,
  disabled,
}: EditHookEventsProps) => (
  <div
    style={{
      marginBottom: '32px',
      position: 'relative',
    }}
  >
    <Select
      itemIsEqual={isEqual}
      itemToString={hookTypeToString}
      multiple={true}
      items={Object.keys(hookEvents)}
      label="Hook Events"
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
    <div
      style={{
        position: 'absolute',
        right: '-71px',
        top: '29px',
      }}
    >
      <Tooltip text="These are the events that will trigger an XHR POST call to the provided url. Leaving this feild blank has the same effect as selecting all hook events.">
        <Icon icon="infoCircleOutline" />
      </Tooltip>
    </div>
  </div>
);
