import { Tooltip } from '@mui/material';
import { FORMAT, FORMAT_SHORTER } from '@sorry-cypress/dashboard/constants';
import { format } from 'date-fns';
import React, { FunctionComponent } from 'react';

export const FormattedDate: DateComponent = (props) => {
  const { value, showTooltip = true, short = false } = props;
  const render = <span>{format(value, short ? FORMAT_SHORTER : FORMAT)}</span>;

  if (showTooltip) {
    return <Tooltip title={value.toUTCString()}>{render}</Tooltip>;
  }

  return render;
};

type DateProps = {
  value: Date;
  showTooltip?: boolean;
  short?: boolean;
};

type DateComponent = FunctionComponent<DateProps>;
