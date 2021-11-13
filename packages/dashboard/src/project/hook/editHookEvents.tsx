import {
  Box,
  Checkbox,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { HookEvent, HookWithCustomEvents } from '@sorry-cypress/common';
import { Chip, InputFieldLabel } from '@sorry-cypress/dashboard/components';
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
    <Grid container>
      <Grid item xs={12}>
        <InputFieldLabel
          htmlFor="hookEvents"
          label="Hook Events"
          helpText="Events to trigger the webhook. Leaving this field blank activates all the events."
          errorMessage={errors['hookEvents']?.message}
        >
          <Controller
            control={control}
            name="hookEvents"
            defaultValue={hook.hookEvents}
            render={({ name, value, onChange, ref }) => (
              <Select
                multiple={true}
                name={name}
                inputRef={ref}
                disabled={disabled}
                onChange={(event) => onChange(event.target.value)}
                value={value}
                input={<OutlinedInput label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value: string) => (
                      <Chip
                        key={value}
                        label={enumToString(value)}
                        color="blue"
                      />
                    ))}
                  </Box>
                )}
                size="small"
              >
                {Object.keys(HookEvent)
                  .sort()
                  .map((event) => (
                    <MenuItem key={event} value={event}>
                      <Checkbox checked={value.indexOf(event) > -1} />
                      <ListItemText primary={enumToString(event)} />
                    </MenuItem>
                  ))}
              </Select>
            )}
          />
        </InputFieldLabel>
      </Grid>
    </Grid>
  );
};
