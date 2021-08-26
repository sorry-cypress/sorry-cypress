import { HookEvent, HookWithCustomEvents } from '@sorry-cypress/common';
import { InputFieldLabel } from '@sorry-cypress/dashboard/components';
import { Cell, Select } from 'bold-ui';
import { isEqual } from 'lodash';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { enumToString } from './hook.utils';

interface EditHookEventsProps {
  hook: HookWithCustomEvents;
  disabled: boolean;
}
export const EditHookEvents = ({ hook, disabled }: EditHookEventsProps) => {
  const { errors, control } = useFormContext();
  return (
    <Cell xs={12}>
      <InputFieldLabel
        label="Hook Events"
        helpText="Events to trigger the webhook. Leaving this field blank activates all the events."
        error={errors['hookEvents']?.message}
      >
        <Controller
          control={control}
          name="hookEvents"
          defaultValue={hook.hookEvents}
          render={({ name, value, onChange, ref }) => (
            <Select
              itemIsEqual={isEqual}
              itemToString={enumToString}
              multiple={true}
              items={Object.keys(HookEvent)}
              name={name}
              inputRef={ref}
              disabled={disabled}
              onChange={(events: HookEvent[]) => onChange(events)}
              value={value}
            />
          )}
        />
      </InputFieldLabel>
    </Cell>
  );
};
