import {
  Box,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React, { FunctionComponent } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

export const InsightsFilter: InsightFilterComponent = (props) => {
  const { selectedValue, setSelectedValue, options, label } = props;

  const handleSelectChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setSelectedValue(value);
  };

  return (
    <Box
      sx={{
        minWidth: 80,
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}
      mt={0}
      pt={0}
    >
      <FormControl fullWidth>
        <Select
          displayEmpty
          input={
            <OutlinedInput
              placeholder={label}
              notched={false}
              sx={{ fontWeight: '500', color: 'dodgerblue' }}
            />
          }
          id={`${label}-select`}
          value={selectedValue}
          label={label}
          onChange={handleSelectChange}
        >
          <MenuItem value="" sx={{ fontWeight: '500', color: 'dodgerblue' }}>
            {label}
          </MenuItem>
          {Object.keys(options).map((key) => {
            const option = options[key];
            return (
              <MenuItem
                key={key}
                value={option.value}
                sx={{ fontWeight: '500', color: 'dodgerblue' }}
              >
                {option.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

type InsightsFilterProps = {
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  options: { [key: string]: SelectOption };
  label: string;
};

type InsightFilterComponent = FunctionComponent<InsightsFilterProps>;
