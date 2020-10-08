import React from 'react';
import { format } from 'date-fns';
import { Tooltip } from 'bold-ui';

const FORMAT = 'MMM dd yyyy, HH:mm:ss';
export const Date = ({ value }: { value: Date }) => {
  return (
    <Tooltip text={value.toUTCString()}>
      <span>{format(value, FORMAT)}</span>
    </Tooltip>
  );
};
