import { useReactiveVar } from '@apollo/client';
import {
  LibraryBooks,
  PlayLesson as PlayLessonIcon,
} from '@mui/icons-material';
import {
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  NavItemType,
  navStructure,
} from '@sorry-cypress/dashboard/lib/navigation';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const HomeListMenu: HomeListMenuType = ({ open, onItemClick }) => {
  const nav = useReactiveVar(navStructure);
  const isCIBuildsView = !!nav.find(
    (item) => item.type === NavItemType.ciBuilds
  );
  const isProjectsView = !!nav.find(
    (item) => item.type === NavItemType.projects
  );

  const menuItems = [
    {
      label: 'Recent Builds',
      link: `/ci-builds`,
      iconComponent: PlayLessonIcon,
      type: NavItemType.ciBuilds,
      isActive: isCIBuildsView,
    },
    {
      label: 'Projects',
      link: `/projects`,
      iconComponent: LibraryBooks,
      type: NavItemType.projects,
      isActive: isProjectsView,
    },
  ];

  return (
    <div>
      {menuItems?.map((item) => {
        if (open) {
          return (
            <ListItemButton
              key={decodeURIComponent(item.label)}
              component={RouterLink}
              to={item.link}
              onClick={onItemClick}
              selected={item.isActive}
            >
              <ListItemIcon sx={{ opacity: 0.6, minWidth: 28 }}>
                <item.iconComponent />
              </ListItemIcon>
              <ListItemText
                primary={decodeURIComponent(item.label)}
                primaryTypographyProps={{
                  fontSize: 16,
                  color: 'text.primary',
                  sx: { opacity: 0.6 },
                  style: { wordBreak: 'break-word' },
                }}
              />
            </ListItemButton>
          );
        }

        return (
          <Tooltip
            key={decodeURIComponent(item.label)}
            title={decodeURIComponent(item.label)}
            placement="right"
            arrow
          >
            <div style={{ paddingBottom: '8px' }}>
              <IconButton
                aria-label={decodeURIComponent(item.label)}
                sx={{ opacity: 0.6, padding: 1.5 }}
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
    </div>
  );
};

type HomeListMenuProps = {
  open: boolean;
  onItemClick: () => void;
};
type HomeListMenuType = React.FC<HomeListMenuProps>;
