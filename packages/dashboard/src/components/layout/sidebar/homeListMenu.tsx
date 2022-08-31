import {
  Book as BookIcon,
  PlayLesson as PlayLessonIcon,
} from '@mui/icons-material';
import {
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { NavItemType } from '@sorry-cypress/dashboard/lib/navigation';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const HomeListMenu: HomeListMenuType = ({ open, onItemClick }) => {
  const menuItems = [
    {
      label: 'CI Builds',
      link: `/ci-builds`,
      iconComponent: PlayLessonIcon,
      type: NavItemType.ciBuilds,
    },
    {
      label: 'Projects',
      link: `/projects`,
      iconComponent: BookIcon,
      type: NavItemType.projects,
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
                <BookIcon />
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
