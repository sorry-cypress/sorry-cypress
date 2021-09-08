import styled from '@emotion/styled';
import { theme } from '@sorry-cypress/dashboard/theme';
import { FormControl, FormControlProps, Icon, Tooltip } from 'bold-ui';
import React, { PropsWithChildren } from 'react';

interface InputFieldLabelProps extends FormControlProps {
  helpText?: string;
}
const InfoIcon = styled(Icon)`
  margin-right: 0.5rem;
  fill: ${theme.pallete.gray.c50};

  &:hover {
    fill: ${theme.pallete.text.main};
  }
`;

export const InputFieldLabel = (
  props: PropsWithChildren<InputFieldLabelProps>
) => {
  const { label, helpText, ...rest } = props;
  const Help = helpText ? (
    <Tooltip text={helpText}>
      <InfoIcon size={1} icon="infoCircleOutline" />
    </Tooltip>
  ) : null;
  return (
    <FormControl
      label={
        <>
          {Help}
          <span>{label}</span>
        </>
      }
      {...rest}
    />
  );
};
