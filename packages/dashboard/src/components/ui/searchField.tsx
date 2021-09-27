import { Search } from '@mui/icons-material';
import { InputAdornment, TextField, Theme } from '@mui/material';
import useDebounce from '@sorry-cypress/dashboard/hooks/useDebounce';
import { WithMaterial } from '@sorry-cypress/dashboard/lib/material';
import React, { ChangeEvent, useState } from 'react';

export type OnSearch = (value: string) => unknown;

type SearchFieldProps = {
  onSearch: OnSearch;
  placeholder: string;
  disabled?: boolean;
};

const SearchField = ({ placeholder, onSearch, disabled }: SearchFieldProps) => {
  const debounce = useDebounce();
  const [value, setValue] = useState('');

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setValue(value);
    debounce(() => {
      onSearch(value);
    });
  };

  return (
    <WithMaterial>
      <TextField
        fullWidth
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        inputProps={{
          sx: {
            pt: 0.8,
            pb: 0.8,
            width: { lg: 180 },
            transition: (theme: Theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.short,
              }),
            '&:focus': {
              width: { lg: 300 },
            },
          },
        }}
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={handleOnChange}
        disabled={disabled}
      />
    </WithMaterial>
  );
};

export { SearchField };
