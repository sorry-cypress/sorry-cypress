import React, { FC, ChangeEvent, useState } from "react";
import { TextField, useCss } from "bold-ui";
import { useDebounce } from "../../hooks/useDebounce";

export type OnSearch = (value: string) => unknown;

export type SearchFieldProps = {
  label: string;
  placeholder?: string;
  onSearch: OnSearch;
  disabled?: boolean;
};

const SearchField: FC<SearchFieldProps> = ({
  label,
  placeholder,
  onSearch,
  disabled
}: SearchFieldProps) => {
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
    <TextField
      label={ label }
      placeholder={ placeholder }
      value={ value }
      onChange={ handleOnChange }
      disabled={ disabled }
      className={ css`
        flex: 1;
      ` }
    />
  );
};

export default SearchField;
