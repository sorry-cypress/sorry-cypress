import {
  MoreVert as MoreVertIcon,
  SvgIconComponent,
} from '@mui/icons-material';
import {
  Breakpoint,
  Button,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Theme,
} from '@mui/material';
import { SxProps } from '@mui/system';
import { useBreakpoint } from '@sorry-cypress/dashboard/hooks';
import { indexOf } from 'lodash';
import React, { MouseEvent } from 'react';
import { SearchField } from './searchField';

type ToolbarProps = {
  actions?: ToolbarAction[];
  onSearch?: (text: string) => void;
  searchPlaceholder?: string;
  sx?: SxProps<Theme> | undefined;
};

type ToolbarType = React.FC<ToolbarProps>;

type ToolbarAction = {
  key: string;
  text: string;
  icon: SvgIconComponent;
  primary: boolean;
  showInMenuBreakpoint?: Breakpoint[];
  onClick: () => void;
};

const Toolbar: ToolbarType = (props) => {
  const { actions = [], onSearch, searchPlaceholder, sx } = props;

  const breakpoint = useBreakpoint();
  const outsideActions: ToolbarAction[] = [];
  const moreActions: ToolbarAction[] = [];
  actions.forEach((action) => {
    if (
      action.showInMenuBreakpoint &&
      indexOf(action.showInMenuBreakpoint || [], breakpoint) !== -1
    ) {
      moreActions.push(action);
    } else {
      outsideActions.push(action);
    }
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid
      container
      justifyContent="flex-end"
      alignItems="center"
      sx={{ mb: { xs: 3, lg: 1 }, ...sx }}
    >
      <Grid
        item
        container
        xs={12}
        lg="auto"
        justifyContent="flex-end"
        alignItems="center"
        mb={{ xs: 1, lg: 0 }}
        mr={{ xs: 0, lg: 2 }}
      >
        <Grid item xs>
          {outsideActions.map((action) => (
            <Button
              key={action.key}
              disableElevation
              variant="outlined"
              color={action.primary ? 'primary' : 'secondary'}
              size="medium"
              startIcon={action.icon && <action.icon />}
              onClick={action.onClick}
            >
              {action.text}
            </Button>
          ))}
        </Grid>
        {moreActions.length > 0 && (
          <Grid item xs="auto" sx={{ display: { lg: 'none' } }}>
            <IconButton
              aria-label="More Actions"
              aria-controls="more-actions-menu"
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="more-actions-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{ sx: { minWidth: 200 } }}
            >
              {moreActions.map((action) => (
                <MenuItem
                  key={action.key}
                  onClick={() => {
                    handleClose();
                    action.onClick();
                  }}
                >
                  {action.icon && (
                    <ListItemIcon>
                      <action.icon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText>{action.text}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        )}
      </Grid>
      {onSearch && (
        <Grid item xs={12} lg="auto">
          <SearchField
            placeholder={searchPlaceholder || 'Search'}
            onSearch={onSearch}
          />
        </Grid>
      )}
    </Grid>
  );
};

export { Toolbar };
