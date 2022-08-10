import { Clear, Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, Theme } from '@mui/material';
import useDebounce from '@sorry-cypress/dashboard/hooks/useDebounce';
import React, { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

export type OnSearch = (value: string) => unknown;

type SearchFieldProps = {
  onSearch: OnSearch;
  placeholder: string;
  disabled?: boolean;
};

const SearchField = ({ placeholder, onSearch, disabled }: SearchFieldProps) => {
  const debounce = useDebounce();
  const [searchParams, setSearchParams] = useSearchParams();
  const setValue = (value: string) => {
    setSearchParams({ search: value });
    debounce(() => {
      onSearch(value);
    });
  };
  const clearSearch = () => {
    setValue('');
  };

  const value = searchParams.get('search') || '';
  if (value) {
    debounce(() => {
      onSearch(value);
    });
  }

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
  };

  return (
    <TextField
      fullWidth
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment
            position="end"
            style={value ? {} : { display: 'none' }}
            onClick={clearSearch}
          >
            <IconButton>
              <Clear />
            </IconButton>
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
  );
};

export { SearchField };
