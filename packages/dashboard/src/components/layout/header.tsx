import { useReactiveVar } from '@apollo/client';
import {
  BookOutlined,
  HomeOutlined as HomeOutlinedIcon,
  Menu as MenuIcon,
  NavigateNext as NavigateNextIcon,
  PlayLessonOutlined,
  PlaylistAdd,
  RuleFolderOutlined,
  RuleOutlined,
  ScienceOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import {
  Breadcrumbs,
  FormControlLabel,
  FormGroup,
  IconButton,
  Link,
  styled,
  Switch,
  Toolbar,
  Tooltip,
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useAutoRefresh } from '@sorry-cypress/dashboard/hooks';
import {
  NavItemType,
  navStructure,
} from '@sorry-cypress/dashboard/lib/navigation';
import { getBase } from '@sorry-cypress/dashboard/lib/path';
import { initial, isNil, last, truncate } from 'lodash';
import React, { FunctionComponent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { DRAWER_WIDTH, DRAWER_WIDTH_SM } from './sidebar';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  [theme.breakpoints.up('md')]: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: DRAWER_WIDTH,
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    ...(!open && {
      marginLeft: DRAWER_WIDTH_SM,
      width: `calc(100% - ${DRAWER_WIDTH_SM}px)`,
    }),
  },
  backgroundColor: '#F8F9FA',
}));

const ICONS = {
  [NavItemType.project]: BookOutlined,
  [NavItemType.newProject]: PlaylistAdd,
  [NavItemType.projectSettings]: SettingsOutlined,
  [NavItemType.run]: RuleFolderOutlined,
  [NavItemType.latestRuns]: PlayLessonOutlined,
  [NavItemType.spec]: RuleOutlined,
  [NavItemType.test]: ScienceOutlined,
} as { [key in NavItemType]: typeof BookOutlined };

export const Header: HeaderComponent = ({ open, onMenuClick }) => {
  const nav = useReactiveVar(navStructure);
  const navItems = nav.length > 1 ? initial(nav) : [];
  const lastNavItem = nav.length > 1 ? last(nav) : nav?.[0];
  const LastItemIcon =
    lastNavItem && !isNil(lastNavItem.type) && ICONS[lastNavItem.type];
  const [shouldAutoRefresh, setShouldAutoRefresh] = useAutoRefresh();

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar sx={{ pl: { xs: 1 } }}>
        <IconButton
          color="primary"
          aria-label="Menu"
          component="span"
          onClick={onMenuClick}
          sx={{ mr: 1.5 }}
          size="large"
        >
          <MenuIcon />
        </IconButton>
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ flex: 1 }}
          separator={<NavigateNextIcon color="disabled" fontSize="small" />}
        >
          <Link
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: lastNavItem ? 'text.primary' : 'text.secondary',
              fontWeight: lastNavItem ? undefined : '500',
            }}
            color="inherit"
            component={RouterLink}
            underline="hover"
            to="/"
          >
            <HomeOutlinedIcon
              sx={{
                mr: 0.5,
                color: lastNavItem ? 'text.primary' : 'text.secondary',
              }}
              fontSize="medium"
            />
            Home
          </Link>
          {navItems.map((navItem) => {
            const Icon = !isNil(navItem.type) ? ICONS[navItem.type] : undefined;
            return (
              <Tooltip
                title={decodeURIComponent(navItem.label ?? '')}
                key={navItem.label}
              >
                <Link
                  component={navItem?.link ? RouterLink : 'span'}
                  underline={navItem?.link ? 'hover' : 'none'}
                  to={navItem?.link ? `/${navItem.link}` : undefined}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#6a6a6a',
                  }}
                >
                  {Icon && (
                    <Icon
                      sx={{ mr: 0.5, color: 'text.primary' }}
                      fontSize="medium"
                    />
                  )}
                  {navItem.type === NavItemType.spec
                    ? getBase(decodeURIComponent(navItem.label ?? ''))
                    : truncate(decodeURIComponent(navItem.label ?? ''))}
                </Link>
              </Tooltip>
            );
          })}
          {lastNavItem && (
            <Tooltip title={decodeURIComponent(lastNavItem.label ?? '')}>
              <Link
                component={lastNavItem?.link ? RouterLink : 'span'}
                underline={lastNavItem?.link ? 'hover' : 'none'}
                to={lastNavItem?.link ? `/${lastNavItem?.link}` : undefined}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.secondary',
                  fontWeight: '500',
                }}
              >
                {LastItemIcon && (
                  <LastItemIcon sx={{ mr: 0.5 }} fontSize="medium" />
                )}
                {lastNavItem.type === NavItemType.spec
                  ? getBase(decodeURIComponent(lastNavItem.label ?? ''))
                  : truncate(decodeURIComponent(lastNavItem.label ?? ''))}
              </Link>
            </Tooltip>
          )}
        </Breadcrumbs>
        <FormGroup>
          <Tooltip
            title="Toggle polling for updates
          "
          >
            <FormControlLabel
              control={
                <Switch
                  checked={!!shouldAutoRefresh}
                  onChange={() => {
                    setShouldAutoRefresh(!shouldAutoRefresh);
                    window.location.reload();
                  }}
                  inputProps={{ 'aria-label': 'Auto Refresh' }}
                />
              }
              sx={{
                color: 'text.primary',
              }}
              label="Auto Refresh"
            />
          </Tooltip>
        </FormGroup>
      </Toolbar>
    </AppBar>
  );
};

type HeaderProps = { open: boolean; onMenuClick: () => void };
type HeaderComponent = FunctionComponent<HeaderProps>;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
