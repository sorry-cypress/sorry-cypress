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
      <InfoOutlinedIcon fontSize="small" sx={{ marginRight: '0.25rem' }} />
    </Tooltip>
  );
  return (
    <FormControl
      fullWidth
      required={required}
      style={{ marginBottom: '1.5rem' }}
    >
      <FormLabel
        htmlFor={htmlFor}
        sx={{ display: 'flex', marginBottom: '0.5rem' }}
      >
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
