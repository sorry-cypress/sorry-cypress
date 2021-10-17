import { SvgIconComponent } from '@mui/icons-material';
import {
  alpha,
  Chip as UIChip,
  ChipProps as UIChipProps,
  colors,
} from '@mui/material';
import { get } from 'lodash';
import React, { forwardRef, FunctionComponent } from 'react';

export const Chip: ChipComponent = forwardRef((props, ref) => {
  const { color, icon: Icon, shade = 400, ...restProps } = props;

  return (
    <UIChip
      ref={ref}
      size="small"
      icon={
        Icon && (
          <Icon
            sx={{
              color: `${alpha(get(colors, [color, shade]), 0.85)} !important`,
            }}
          />
        )
      }
      {...restProps}
      sx={{
        backgroundColor: alpha(get(colors, [color, shade]), Icon ? 0.15 : 0.4),
        color: Icon ? undefined : 'text.secondary',
        ...restProps.sx,
      }}
    ></UIChip>
  );
});

Chip.displayName = 'ChipRef';

type ChipProps = Omit<UIChipProps, 'color' | 'icon'> & {
  color: keyof typeof colors;
  shade?: keyof typeof colors.grey;
  icon?: SvgIconComponent;
};
type ChipComponent = FunctionComponent<ChipProps>;
