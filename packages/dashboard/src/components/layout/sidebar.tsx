import { useReactiveVar } from '@apollo/client';
import {
  Book as BookIcon,
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  GitHub as GitHubIcon,
  Help as HelpIcon,
  PlayLesson as PlayLessonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  alpha,
  Avatar,
  Button,
  Drawer as MuiDrawer,
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
  StyledEngineProvider,
  Theme,
  ThemeProvider,
  useTheme,
} from '@mui/material/styles';
import { useGetProjectsQuery } from '@sorry-cypress/dashboard/generated/graphql';
import {
  NavItemType,
  navStructure,
} from '@sorry-cypress/dashboard/lib/navigation';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { version } from '../../../package.json';

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
    fontFamily: 'IBM Plex Sans',
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
  ...theme.mixins.toolbar,
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
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<SidebarProps>(({ theme, open }) => {
  return {
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
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

export const ProjectListMenu: ProjectListMenuType = ({
  projects,
  open,
  onItemClick,
}) => {
  return (
    <div>
      {projects?.map((project) => {
        if (open) {
          return (
            <ListItemButton
              key={decodeURIComponent(project.projectId)}
              sx={{ pl: 4 }}
              component={RouterLink}
              to={`/${project.projectId}/runs`}
              onClick={onItemClick}
            >
              <ListItemIcon
                sx={{ opacity: 0.6, minWidth: 28, color: project.projectColor }}
              >
                <BookIcon />
              </ListItemIcon>
              <ListItemText
                primary={decodeURIComponent(project.projectId)}
                primaryTypographyProps={{
                  fontSize: 18,
                  color: 'text.primary',
                  sx: { opacity: 0.6 },
                }}
              />
            </ListItemButton>
          );
        }

        return (
          <Tooltip
            key={decodeURIComponent(project.projectId)}
            title={decodeURIComponent(project.projectId)}
            placement="right"
            arrow
          >
            <div style={{ paddingBottom: '8px' }}>
              <IconButton
                aria-label={decodeURIComponent(project.projectId)}
                sx={{ opacity: 0.6, padding: 1.5, color: project.projectColor }}
                component={RouterLink}
                to={`/${project.projectId}/runs`}
                onClick={onItemClick}
                size="large"
              >
                <BookIcon />
              </IconButton>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

export const ProjectDetailsMenu: ProjectDetailsMenuType = ({
  projectId,
  projectColor,
  open,
  onItemClick,
  selectedItem,
}) => {
  const projectMenuItems = [
    {
      label: 'Latest runs',
      link: `/${projectId}/runs`,
      iconComponent: PlayLessonIcon,
      type: NavItemType.latestRuns,
    },
    {
      label: 'Project settings',
      link: `/${projectId}/edit`,
      iconComponent: SettingsIcon,
      type: NavItemType.projectSettings,
    },
  ];
  return (
    <>
      {projectMenuItems.map((item) => {
        const selected = selectedItem === item.type;
        if (open) {
          return (
            <ListItemButton
              key={item.label}
              color={selected ? 'primary' : undefined}
              sx={{
                ml: 2,
                mb: 1,
                mr: { md: 0, xs: 2 },
                pl: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                backgroundColor: selected
                  ? 'rgba(255, 255, 255, 0.1)'
                  : undefined,
                borderTopLeftRadius: 8,
                borderTopRightRadius: { md: 0, xs: 8 },
                borderBottomRightRadius: { md: 0, xs: 8 },
                borderBottomLeftRadius: 8,
              }}
              component={RouterLink}
              to={item.link}
              selected={selected}
              onClick={onItemClick}
            >
              <ListItemIcon sx={{ opacity: selected ? 1 : 0.6, minWidth: 28 }}>
                <item.iconComponent color={selected ? 'primary' : undefined} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 18,
                  color: selected ? 'primary' : 'text.primary',
                  sx: { opacity: selected ? 1 : 0.6 },
                }}
              />
            </ListItemButton>
          );
        }

        return (
          <Tooltip key={item.label} title={item.label} placement="right" arrow>
            <div style={{ paddingBottom: '8px' }}>
              <IconButton
                aria-label={item.label}
                color={selected ? 'primary' : undefined}
                sx={{
                  opacity: selected ? 1 : 0.6,
                  padding: 1.5,
                  backgroundColor: selected
                    ? alpha(projectColor || '#3486E3', 0.1)
                    : undefined,
                  color: selected ? projectColor || '#3486E3' : undefined,
                }}
                component={RouterLink}
                to={item.link}
                onClick={onItemClick}
                size="large"
              >
                <item.iconComponent />
              </IconButton>
            </div>
          </Tooltip>
        );
      })}
    </>
  );
};

export const Sidebar: SidebarType = ({ open, onToggleSidebar }) => {
  const nav = useReactiveVar(navStructure);
  const projectNavItem = nav.find((item) => item.type === NavItemType.project);
  const projectView = projectNavItem && nav?.[1];
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
  const isHome = !loading && !error && !projectNavItem;
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
        <ListItem
          component="div"
          sx={{
            justifyContent: 'center',
            maxWidth: 300,
          }}
        >
          <ListItemAvatar sx={{ minWidth: '42px' }}>
            <RouterLink to="/">
              <Avatar
                alt="Sorry Cypress Dashboard Home"
                src={`https://gblobscdn.gitbook.com/spaces%2F-MS6gDAYECuzpKjjzrdc%2Favatar-1611996755562.png?alt=media`}
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
          <ListItemText
            sx={{
              m: smallScreen ? 1 : 0,
            }}
            primary={<span>Sorry Cypress</span>}
            primaryTypographyProps={{
              sx: {
                transition: 'all 0.3s',
                textDecoration: 'none',
                opacity: open ? 1 : 0,
              },
              fontSize: open ? 28 : 0,
              width: open ? undefined : 0,
              letterSpacing: 0,
              textAlign: smallScreen ? 'left' : 'right',
              color: 'text.primary',
              component: RouterLink,
              to: '/',
            }}
            secondary={`v${version}`}
            secondaryTypographyProps={{
              sx: {
                transition: 'all 0.3s',
                opacity: open ? 1 : 0,
              },
              fontSize: open ? 14 : 0,
              width: open ? undefined : 0,
              letterSpacing: 0,
              textAlign: smallScreen ? 'left' : 'right',
              component: Link,
              underline: 'none',
              target: '_blank',
              href: `https://github.com/sorry-cypress/sorry-cypress/releases/tag/v${version}`,
              rel: 'noopener noreferrer',
            }}
          />
        </ListItem>
        {open && (
          <IconButton
            color="default"
            aria-label=" Close Menu"
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
        <ListItem component="div">
          {open && (
            <ListItemText
              sx={{ mt: 4, mb: 2 }}
              primary={
                isHome
                  ? 'Projects'
                  : decodeURIComponent(projectNavItem?.label || '')
              }
              primaryTypographyProps={{
                fontSize: 22,
                letterSpacing: 0,
                color: 'text.primary',
              }}
            />
          )}
        </ListItem>
        {loading &&
          ['loading1', 'loading2', 'loading3'].map((key) => (
            <Skeleton
              variant="rectangular"
              height={26}
              key={key}
              sx={{ my: 3, ml: 4, mr: 2 }}
            />
          ))}
        {!loading && isHome && (
          <ProjectListMenu
            projects={projects}
            open={open}
            onItemClick={handleMenuItemClick}
          />
        )}
        {!loading && !isHome && projectNavItem?.label && projectView?.type && (
          <ProjectDetailsMenu
            projectId={projectNavItem.label}
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
        <div>
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
        </div>

        <div>
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
        </div>

        <div>
          <Tooltip title="Become a sponsor" placement="right" arrow>
            <IconButton
              aria-label="Become a sponsor"
              sx={{
                padding: open ? 1 : 1.5,
                flex: open ? 1 : undefined,
                textAlign: 'right',
              }}
              component={Link}
              href="https://github.com/sponsors/agoldis"
              target="_blank"
              rel="noreferrer"
              size="large"
            >
              <FavoriteIcon
                {...(open ? { component: FavoriteBorderIcon } : {})}
                sx={{
                  fontSize: open ? 20 : undefined,
                  '&:hover': {
                    color: red[700],
                  },
                  transition: 'all 0.5s',
                  color: red[300],
                }}
              />
            </IconButton>
          </Tooltip>
        </div>
      </DrawerFooter>
    </DrawerContentContainer>
  );

  const DrawerComponent = smallScreen ? MuiDrawer : Drawer;
  return (
    <StyledEngineProvider injectFirst>
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
    </StyledEngineProvider>
  );
};

type SidebarProps = { open: boolean; onToggleSidebar?: () => void };
type SidebarType = React.FC<SidebarProps>;

type ProjectDetailsMenuProps = {
  projectId: string;
  projectColor?: string;
  open: boolean;
  onItemClick: () => void;
  selectedItem: NavItemType;
};
type ProjectDetailsMenuType = React.FC<ProjectDetailsMenuProps>;

type ProjectListMenuProps = {
  projects: Array<{ projectId: string; projectColor: string }>;
  open: boolean;
  onItemClick: () => void;
};
type ProjectListMenuType = React.FC<ProjectListMenuProps>;
