import { SvgIconComponent } from '@mui/icons-material';
import {
  alpha,
  Chip as UIChip,
  ChipProps as UIChipProps,
  colors,
} from '@mui/material';
import { get } from 'lodash';
import React, { forwardRef, FunctionComponent, ReactElement } from 'react';

export const Chip: ChipComponent = forwardRef((props, ref) => {
  const { color, icon: Icon, shade = 400, endIcon, ...restProps } = props;

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
      {...(endIcon
        ? {
            deleteIcon: endIcon.icon,
            onDelete: () => null,
          }
        : {})}
      {...restProps}
      sx={{
        backgroundColor: alpha(get(colors, [color, shade]), Icon ? 0.15 : 0.4),
        color: Icon ? undefined : 'text.secondary',
        ...(endIcon
          ? {
              '& .MuiChip-deleteIcon': {
                cursor: 'default',
                color: endIcon.color,
                '&:hover': {
                  color: endIcon.color,
                },
              },
            }
          : {}),
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
  endIcon?: {
    icon: ReactElement<any>;
    color?: string;
  };
};
type ChipComponent = FunctionComponent<ChipProps>;
