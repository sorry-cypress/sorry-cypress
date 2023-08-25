import { Grid, Typography } from '@mui/material';
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { InsightsFilter } from './insightsFilters';

interface SelectOption {
  value: string;
  label: string;
}

const environments: { [key: string]: SelectOption } = {
  dev: { value: 'dev', label: 'Development' },
  staging: { value: 'staging', label: 'Staging' },
  pr: { value: 'pr', label: 'Pull Request' },
  qa1: { value: 'qa1', label: 'QA1' },
  qa2: { value: 'qa2', label: 'QA2' },
};

const dateRanges = {
  '30': { value: '30', label: 'Last 30 Days' },
  '60': { value: '60', label: 'Last 60 Days' },
  '90': { value: '90', label: 'Last 90 Days' },
};

export const InsightsMenu: InsightsMenuComponent = (props) => {
  const {
    selectedEnvironment,
    setSelectedEnvironment,
    selectedDateRange,
    setSelectedDateRange,
  } = props;

  return (
    <Grid
      container
      direction="row"
      spacing={2}
      alignContent="flex-end"
      mb={2}
      pt={0}
    >
      <Grid item xs={12}>
        <Typography variant="overline">Filter by</Typography>
      </Grid>

      <Grid item xs={2}>
        <InsightsFilter
          selectedValue={selectedEnvironment}
          setSelectedValue={setSelectedEnvironment}
          options={environments}
          label="Environments"
        />
      </Grid>
      <Grid item xs={2}>
        <InsightsFilter
          selectedValue={selectedDateRange}
          setSelectedValue={setSelectedDateRange}
          options={dateRanges}
          label="Date Range"
        />
      </Grid>
    </Grid>
  );
};

type InsightsMenuProps = {
  selectedEnvironment: string;
  setSelectedEnvironment: Dispatch<SetStateAction<string>>;
  selectedDateRange: string;
  setSelectedDateRange: Dispatch<SetStateAction<string>>;
};

type InsightsMenuComponent = FunctionComponent<InsightsMenuProps>;
