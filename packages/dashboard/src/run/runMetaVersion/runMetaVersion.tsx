import { Sell as SellIcon, Timer as TimerIcon } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { Chip } from '@sorry-cypress/dashboard/components';
import { environment } from '@sorry-cypress/dashboard/state/environment';
import React, { FunctionComponent } from 'react';

export const RunMetaVersion: RunMetaVersionComponent = (props) => {
  const { serviceName, versionNumber, type, index } = props;

  const colors: {
    [index: number]:
      | 'amber'
      | 'blue'
      | 'blueGrey'
      | 'brown'
      | 'common'
      | 'cyan'
      | 'deepOrange'
      | 'deepPurple'
      | 'green'
      | 'grey'
      | 'indigo'
      | 'lightBlue'
      | 'lightGreen'
      | 'lime'
      | 'orange'
      | 'pink'
      | 'purple'
      | 'red'
      | 'teal'
      | 'yellow';
  } = {
    0: 'teal',
    1: 'amber',
    2: 'blue',
    3: 'blueGrey',
    4: 'brown',
    5: 'cyan',
    6: 'deepOrange',
    7: 'deepPurple',
    8: 'green',
    9: 'grey',
    10: 'indigo',
    11: 'lightBlue',
    12: 'lightGreen',
    13: 'lime',
    14: 'orange',
    15: 'pink',
    16: 'purple',
    17: 'red',
    18: 'yellow',
  };

  let colorValue: number = index || 0;
  if (environment.COLOR_INDEX > 0) {
    colorValue = environment.COLOR_INDEX;
  }
  while (colorValue > 18) {
    colorValue -= 19;
  }
  const selectedColor = colors[colorValue] || colors[9];
  return (
    <Tooltip
      title={
        <>
          {type}: {serviceName}: {versionNumber}
        </>
      }
      arrow
    >
      <Chip
        size="small"
        color={selectedColor}
        shade={500}
        label={`${serviceName}: ${versionNumber}`}
        icon={type === 'VERSION' ? SellIcon : TimerIcon}
      />
    </Tooltip>
  );
};

type RunMetaVersionProps = {
  serviceName: string | undefined;
  versionNumber: string | undefined;
  type: string | null | undefined;
  index: number | undefined;
};
type RunMetaVersionComponent = FunctionComponent<RunMetaVersionProps>;
