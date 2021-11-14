import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormLabel,
  Tooltip,
} from '@mui/material';
import React, { PropsWithChildren, ReactNode } from 'react';

interface InputFieldLabelProps extends FormControlProps {
  helpText?: string;
  htmlFor: string;
  label?: string | ReactNode;
  errorMessage?: string;
}

export const InputFieldLabel = (
  props: PropsWithChildren<InputFieldLabelProps>
) => {
  const { label, helpText, errorMessage, htmlFor, children, required } = props;
  const hasError = errorMessage ? true : false;
  const Help = helpText && (
    <Tooltip title={helpText}>
      <InfoOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
    </Tooltip>
  );
  return (
    <FormControl fullWidth required={required} sx={{ mb: 1.5 }}>
      <FormLabel htmlFor={htmlFor} sx={{ display: 'flex', marginBottom: 0.5 }}>
        {Help}
        <span>{label}</span>
      </FormLabel>
      {children}
      <FormHelperText error={hasError} id={htmlFor}>
        {errorMessage}
      </FormHelperText>
    </FormControl>
  );
};
