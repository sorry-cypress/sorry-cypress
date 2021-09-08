import { TextField } from '@material-ui/core';
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
