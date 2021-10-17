import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  Tooltip,
} from '@mui/material';
import React, { PropsWithChildren } from 'react';

interface InputFieldLabelProps extends FormControlProps {
  helpText: string;
  id: string;
  label?: string;
  hasError: boolean;
  errorMessage?: string;
}

export const InputFieldLabel = (
  props: PropsWithChildren<InputFieldLabelProps>
) => {
  const { label, helpText, hasError, errorMessage, id, children } = props;
  const Help = helpText && (
    <Tooltip title={helpText}>
      <InfoOutlinedIcon fontSize={'inherit'} />
    </Tooltip>
  );
  return (
    <FormControl fullWidth>
      {Help}
      <InputLabel htmlFor={id}>{label}</InputLabel>
      {children}
      <FormHelperText error={hasError} id={id}>
        {errorMessage}
      </FormHelperText>
    </FormControl>
  );
};
