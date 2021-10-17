import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import {
  Box,
  Card as UICard,
  CardActionArea,
  CardActions,
  CardProps as UICardProps,
  Collapse,
  Link,
} from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import React, { FunctionComponent } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const Card: CardComponent = (props) => {
  const { linkTo, actions, children, showActions, ...restProps } = props;

  let render = children;
  if (actions) {
    render = <Box sx={{ flex: 1 }}>{render}</Box>;
  }
  if (linkTo) {
    render = (
      <Link
        component={RouterLink}
        to={linkTo}
        underline="none"
        sx={{ flex: 1 }}
      >
        <CardActionArea>
          <Box color="text.primary">{render}</Box>
        </CardActionArea>
      </Link>
    );
  }

  return (
    <UICard
      elevation={0}
      {...restProps}
      sx={{ my: 2, display: actions ? 'flex' : undefined, ...restProps.sx }}
    >
      {render}
      {actions && (
        <CardActions sx={{ backgroundColor: blueGrey[50], p: 0 }}>
          <Collapse orientation="horizontal" in={showActions}>
            <Box sx={{ px: 4, py: 1 }}>{actions}</Box>
          </Collapse>
        </CardActions>
      )}
    </UICard>
  );
};

type CardProps = UICardProps & {
  actions?: ReactJSXElement;
  linkTo?: string;
  showActions?: boolean;
};
type CardComponent = FunctionComponent<CardProps>;
