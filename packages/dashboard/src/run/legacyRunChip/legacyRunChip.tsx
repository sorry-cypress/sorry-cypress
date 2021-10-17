import { Archive } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { Chip } from '@sorry-cypress/dashboard/components';
import React, { FunctionComponent } from 'react';

export const LegacyRunChip: LegacyRunChipComponent = () => {
  return (
    <Tooltip
      title="This is a legacy run created prior to Sorry Cypress 2.0. Some information may be missing."
      arrow
    >
      <Chip
        size="small"
        color="grey"
        shade={600}
        label="legacy run"
        icon={Archive}
      />
    </Tooltip>
  );
};

type LegacyRunChipProps = {
  // No props
};
type LegacyRunChipComponent = FunctionComponent<LegacyRunChipProps>;
