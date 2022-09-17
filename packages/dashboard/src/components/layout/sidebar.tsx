import { useReactiveVar } from '@apollo/client';
import {
  Close as CloseIcon,
  GitHub as GitHubIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  Drawer as MuiDrawer,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { red } from '@mui/material/colors';
import {
  createTheme,
  styled,
  Theme,
  ThemeProvider,
  useTheme,
} from '@mui/material/styles';
import { HomeListMenu } from '@sorry-cypress/dashboard/components/layout/sidebar/homeListMenu';
import { ProjectDetailsMenu } from '@sorry-cypress/dashboard/components/layout/sidebar/projectDetailsMenu';
import { ProjectListMenu } from '@sorry-cypress/dashboard/components/layout/sidebar/projectListMenu';
import { useGetProjectsQuery } from '@sorry-cypress/dashboard/generated/graphql';
import {
  NavItemType,
  navStructure,
} from '@sorry-cypress/dashboard/lib/navigation';
import logoDark from '@sorry-cypress/dashboard/resources/logo-dark.svg';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import packageJson from '../../../package.json';

export const DRAWER_WIDTH = 310;
export const DRAWER_WIDTH_SM = 73;

const sidebarTheme = createTheme({
  components: {
    MuiListItemButton: {
      defaultProps: {
        disableTouchRipple: true,
      },
    },
  },
  palette: {
    mode: 'dark',
    background: { paper: '#252525' },
    primary: {
      main: '#6794D5',
    },
  },
  typography: {
    fontWeightBold: 700,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
  },
});

const openedMixin = (theme: Theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled('div', { name: 'DrawerHeader' })(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
  ...(theme.mixins.toolbar as any),
}));

const DrawerFooter = styled('div', {
  shouldForwardProp: (prop) => prop !== 'open',
})<SidebarProps>(({ theme, open }) => ({
  display: 'flex',
  flexDirection: open ? 'row' : 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.between('sm', 'md')]: {
    justifyContent: 'flex-end',
  },
  width: '100%',
  position: 'absolute',
  bottom: 0,
  overflow: 'auto',
  padding: theme.spacing(0, 1),
  ...(theme.mixins.toolbar as any),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<SidebarProps>(({ theme, open }) => {
  return {
    width: DRAWER_WIDTH,
    flexShrink: 0,
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  } as any;
});

const DrawerContentContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'open',
})<SidebarProps>(({ open }) => ({
  display: 'grid',
  gridTemplateRows: `100px auto ${open ? '60px' : '160px'}`,
  overflowY: 'auto',
  overflowX: 'hidden',
}));

export const Sidebar: SidebarType = ({ open, onToggleSidebar }) => {
  const nav = useReactiveVar(navStructure);
  const projectNavItem = nav.find((item) => item.type === NavItemType.project);
  const projectView = projectNavItem && nav?.[2];
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('md'), {
    noSsr: true,
  });

  const { loading, error, data, refetch } = useGetProjectsQuery({
    variables: {
      orderDirection: null,
      filters: [],
    },
  });
  const { projects } = (data || {}) as {
    projects: Array<{ projectId: string; projectColor: string }>;
  };
  const currentProject = projects?.find(
    (item) => item.projectId === decodeURIComponent(projectNavItem?.label || '')
  );

  const handleMenuItemClick = () => {
    smallScreen && onToggleSidebar?.();
  };

  const drawerContent = (
    <DrawerContentContainer open={open}>
      <DrawerHeader>
        <ListItem component="div">
          <ListItemAvatar sx={{ minWidth: '42px' }}>
            <RouterLink to="/?redirect=false">
              <Avatar
                alt="Sorry Cypress Dashboard Home"
                src={logoDark}
                variant="square"
                sx={{
                  transition: 'all 0.3s',
                  width: open ? 54 : 42,
                  height: open ? 54 : 42,
                  borderRadius: open ? 5 : 2,
                }}
              />
            </RouterLink>
          </ListItemAvatar>
        </ListItem>
        {open && (
          <IconButton
            color="default"
            aria-label="Close Menu"
            component="span"
            size="medium"
            onClick={onToggleSidebar}
            sx={{
              mr: 1,
              display: { md: 'none' },
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
        )}
      </DrawerHeader>
      <List
        component="div"
        disablePadding
        sx={{
          display: open ? 'block' : 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'auto',
        }}
      >
        {loading &&
          ['loading1', 'loading2', 'loading3'].map((key) => (
            <Skeleton
              variant="rectangular"
              height={26}
              key={key}
              sx={{ my: 3, ml: 4, mr: 2 }}
            />
          ))}
        {!loading && (
          <HomeListMenu open={open} onItemClick={handleMenuItemClick} />
        )}
        {!loading && !projectView && (
          <ProjectListMenu
            projects={projects}
            open={open}
            onItemClick={handleMenuItemClick}
          />
        )}
        {!loading && projectNavItem?.label && projectView?.type && (
          <ProjectDetailsMenu
            projectId={decodeURIComponent(projectNavItem?.label || '')}
            projectColor={currentProject?.projectColor}
            open={open}
            selectedItem={projectView.type}
            onItemClick={handleMenuItemClick}
          />
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ mx: 1, whiteSpace: 'normal' }}
            action={
              <Button
                size="small"
                variant="contained"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            }
          >
            <AlertTitle>Error</AlertTitle>
            Something went wrong while loading the project list.
            <br />
            {error.message || error.networkError}
          </Alert>
        )}
      </List>
      <DrawerFooter open={open}>
        <Grid container direction={'column'} alignItems="stretch" p={[2, 1]}>
          <Link
            href={`https://github.com/sorry-cypress/sorry-cypress/releases/tag/v${packageJson.version}`}
          >
            v{packageJson.version}
          </Link>

          {!open && (
            <Tooltip title="Source" placement="right" arrow>
              <IconButton
                aria-label="Source"
                sx={{ padding: 1.5 }}
                component={Link}
                href="https://github.com/sorry-cypress/sorry-cypress"
                target="_blank"
                rel="noreferrer"
                size="large"
              >
                <GitHubIcon
                  sx={{
                    color: red[300],
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
          {open && (
            <ListItemButton
              sx={{ height: 38, borderRadius: '50px', p: 0.75 }}
              component={Link}
              href="https://github.com/sorry-cypress/sorry-cypress"
              target="_blank"
              rel="noreferrer"
            >
              <ListItemIcon sx={{ minWidth: 24 }}>
                <GitHubIcon
                  sx={{
                    fontSize: 20,
                    color: red[300],
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={open ? 'Source' : undefined}
                primaryTypographyProps={{
                  fontSize: 17,
                }}
              />
            </ListItemButton>
          )}

          {!open && (
            <Tooltip title="Documentation" placement="right" arrow>
              <IconButton
                aria-label="Documentation"
                sx={{ padding: 1.5 }}
                component={Link}
                href="https://sorry-cypress.dev/"
                target="_blank"
                rel="noreferrer"
                size="large"
              >
                <HelpIcon
                  sx={{
                    color: red[300],
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
          {open && (
            <ListItemButton
              sx={{ height: 38, borderRadius: '50px', p: 0.75 }}
              component={Link}
              href="https://sorry-cypress.dev/"
              target="_blank"
              rel="noreferrer"
            >
              <ListItemIcon sx={{ minWidth: 24 }}>
                <HelpIcon
                  sx={{
                    fontSize: 20,
                    color: red[300],
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={open ? 'Documentation' : undefined}
                primaryTypographyProps={{
                  fontSize: 17,
                }}
              />
            </ListItemButton>
          )}
        </Grid>
      </DrawerFooter>
    </DrawerContentContainer>
  );

  const DrawerComponent = smallScreen ? MuiDrawer : Drawer;
  return (
    <ThemeProvider theme={sidebarTheme}>
      <DrawerComponent
        variant={smallScreen ? 'temporary' : 'permanent'}
        open={open}
        {...(smallScreen
          ? {
              anchor: 'left',
              ModalProps: {
                keepMounted: true,
              },
            }
          : {})}
        sx={
          smallScreen
            ? {
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: '100%',
                  backgroundImage: 'unset',
                },
              }
            : {}
        }
      >
        {drawerContent}
      </DrawerComponent>
    </ThemeProvider>
  );
};

type SidebarProps = { open: boolean; onToggleSidebar?: () => void };
type SidebarType = React.FC<SidebarProps>;
