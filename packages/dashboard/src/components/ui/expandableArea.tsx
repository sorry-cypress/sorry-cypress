import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
  Collapse,
  IconButton,
  IconButtonProps,
  styled,
  Typography,
} from '@mui/material';
import React, { FunctionComponent, useState } from 'react';

const ExpandButton = styled((props: ExpandButtonProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const ExpandableArea: ExpandableAreaComponent = (props) => {
  const { label, children, defaultExpanded = false } = props;
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <>
      <Typography
        variant="button"
        component="div"
        color="text.primary"
        onClick={() => setExpanded(!expanded)}
        sx={{ cursor: 'pointer' }}
      >
        <ExpandButton size="small" expand={expanded}>
          <ExpandMoreIcon />
        </ExpandButton>{' '}
        {label}
      </Typography>
      <Collapse in={expanded}>{children}</Collapse>
    </>
  );
};

interface ExpandButtonProps extends IconButtonProps {
  expand: boolean;
}

type ExpandableAreaProps = {
  defaultExpanded?: boolean;
  label: string;
};
type ExpandableAreaComponent = FunctionComponent<ExpandableAreaProps>;
