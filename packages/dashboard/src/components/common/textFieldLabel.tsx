import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormLabel,
  Tooltip,
} from '@mui/material';
import React, { PropsWithChildren } from 'react';

interface InputFieldLabelProps extends FormControlProps {
  helpText?: string;
  htmlFor: string;
  label?: string | React.ReactNode;
  errorMessage?: string;
}

export const InputFieldLabel = (
  props: PropsWithChildren<InputFieldLabelProps>
) => {
  const { label, helpText, errorMessage, htmlFor, children, required } = props;
  const hasError = errorMessage ? true : false;
  const Help = helpText && (
    <Tooltip title={helpText}>
      <InfoOutlinedIcon fontSize={'inherit'} />
    </Tooltip>
  );
  return (
    <FormControl fullWidth required={required}>
      <FormLabel htmlFor={htmlFor}>
        {Help}
        {label}
      </FormLabel>
      {children}
      <FormHelperText error={hasError} id={htmlFor}>
        {errorMessage}
      </FormHelperText>
    </FormControl>
  );
};
