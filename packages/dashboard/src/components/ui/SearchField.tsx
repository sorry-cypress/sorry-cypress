import { TextField, useCss } from 'bold-ui';
import React, { ChangeEvent, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';

export type OnSearch = (value: string) => unknown;

type SearchFieldProps = {
  onSearch: OnSearch;
  placeholder: string;
  disabled?: boolean;
};

const SearchField = ({ placeholder, onSearch, disabled }: SearchFieldProps) => {
  const { css } = useCss();
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
    <div
      className={css`
        flex: 1 1;
      `}
    >
      <TextField
        placeholder={placeholder}
        value={value}
        icon="zoomOutline"
        onChange={handleOnChange}
        disabled={disabled}
        className={css`
          padding: calc(0.75rem + 1px) 1rem;
          width: 100%;
        `}
      />
    </div>
  );
};

export { SearchField };
