import {
  ErrorOutlineSharp,
  RadioButtonUnchecked,
  RedoRounded,
  Sync,
} from '@mui/icons-material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Chip, Tooltip } from '@mui/material';
import { WithMaterial } from '@sorry-cypress/dashboard/lib/material';
import React from 'react';

enum CHIP_COLOR {
  DEFAULT = '#929292',
  OVERALL = '#98c2f0',
  RETRIES = '#e3e386',
  SUCCESS = '#85caa8',
  FAILURE = '#ebb8b8',
  SKIPPED = '#f5d79e',
}

const addOpacityToHexColor = (color: CHIP_COLOR, opacity: 0 | 25 | 50 | 75) => {
  switch (opacity) {
    case 0:
      return color + '00';
    case 25:
      return color + '40';
    case 50:
      return color + '7F';
    case 75:
      return color + 'BF';
  }
};

export const TestSuccessBadge = ({ value }: { value: number }) => {
  const color = value ? CHIP_COLOR.SUCCESS : CHIP_COLOR.DEFAULT;
  return (
    <WithMaterial>
      <Tooltip title="Passed Tests">
        <Chip
          icon={<CheckCircleOutlineIcon style={{ fill: color }} />}
          label={value}
          style={{ backgroundColor: addOpacityToHexColor(color, 25) }}
        />
      </Tooltip>
    </WithMaterial>
  );
};

export const TestFailureBadge = ({ value }: { value: number }) => {
  const color = value ? CHIP_COLOR.FAILURE : CHIP_COLOR.DEFAULT;
  return (
    <WithMaterial>
      <Tooltip title="Failed Tests">
        <Chip
          icon={<ErrorOutlineSharp style={{ fill: color }} />}
          label={value}
          style={{ backgroundColor: addOpacityToHexColor(color, 25) }}
        />
      </Tooltip>
    </WithMaterial>
  );
};

export const TestSkippedBadge = ({ value }: { value: number; style?: any }) => {
  const color = value ? CHIP_COLOR.SKIPPED : CHIP_COLOR.DEFAULT;
  return (
    <WithMaterial>
      <Tooltip title="Skipped Tests">
        <Chip
          icon={
            <RedoRounded
              fontSize={'small'}
              style={{
                fill: color,
                border: `solid 2px ${color}`,
                borderRadius: '50%',
              }}
            />
          }
          label={value}
          style={{ backgroundColor: addOpacityToHexColor(color, 25) }}
        />
      </Tooltip>
    </WithMaterial>
  );
};

export const TestRetriesBadge = ({ value }: { value: number }) => {
  const color = value ? CHIP_COLOR.RETRIES : CHIP_COLOR.DEFAULT;

  return (
    <WithMaterial>
      <Tooltip title="Retried Tests">
        <Chip
          icon={
            <Sync
              fontSize={'small'}
              style={{
                fill: color,
                border: `solid 2px ${color}`,
                borderRadius: '50%',
              }}
            />
          }
          label={value}
          style={{ backgroundColor: addOpacityToHexColor(color, 25) }}
        />
      </Tooltip>
    </WithMaterial>
  );
};

export const TestOverallBadge = ({ value }: { value: number }) => {
  return (
    <WithMaterial>
      <Tooltip title="Total Tests">
        <Chip
          icon={<RadioButtonUnchecked style={{ fill: CHIP_COLOR.OVERALL }} />}
          label={value}
          style={{
            backgroundColor: addOpacityToHexColor(CHIP_COLOR.OVERALL, 25),
          }}
        />
      </Tooltip>
    </WithMaterial>
  );
};
