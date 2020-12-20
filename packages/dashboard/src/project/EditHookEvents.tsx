import React from 'react';
import { Icon, Tooltip, Select } from 'bold-ui';
import { hookEvents } from '@src/duplicatedFromDirector/hooksEnums';
import { isEqual } from 'lodash';
import {
  GenericHook as GenericHookType,
  HookEvent,
  SlackHook,
} from '@src/duplicatedFromDirector/project.types';
import { HookFormAction } from './hookFormReducer';
import { hookTypeToString } from './hook.utils';

interface EditHookEventsProps {
  hook: GenericHookType | SlackHook;
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
