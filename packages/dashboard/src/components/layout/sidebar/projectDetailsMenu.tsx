import {
  ArrowBack,
  PlayLesson as PlayLessonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  Divider,
  Grid,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { InnerListItemMenu } from '@sorry-cypress/dashboard/components/layout/sidebar/innerListItemMenu';
import { NavItemType } from '@sorry-cypress/dashboard/lib/navigation';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const ProjectDetailsMenu: ProjectDetailsMenuType = ({
  projectId,
  projectColor,
  open,
  onItemClick,
  selectedItem,
}) => {
  const menuItems = [
    {
      label: 'Latest runs',
      link: `/${encodeURIComponent(projectId)}/runs`,
      iconComponent: PlayLessonIcon,
      type: NavItemType.latestRuns,
    },
    {
      label: 'Project settings',
      link: `/${encodeURIComponent(projectId)}/edit`,
      iconComponent: SettingsIcon,
      type: NavItemType.projectSettings,
    },
  ];
  return (
    <Grid my={1}>
      <Divider />
      <ListItemButton component={RouterLink} to={`/projects`}>
        <ListItemIcon sx={{ opacity: 0.6, minWidth: 28 }}>
          <ArrowBack />
        </ListItemIcon>
        {open && (
          <ListItemText
            primary={decodeURIComponent(projectId)}
            primaryTypographyProps={{
              fontSize: 16,
              color: 'text.primary',
              sx: { opacity: 0.6 },
              style: { wordBreak: 'break-word' },
            }}
          />
        )}
      </ListItemButton>
      <Grid mt={2}>
        {menuItems.map((item) => {
          return (
            <InnerListItemMenu
              key={item.label}
              projectColor={projectColor}
              item={item}
              open={open}
              onItemClick={onItemClick}
              selectedItem={selectedItem}
            />
          );
        })}
      </Grid>
    </Grid>
  );
};

type ProjectDetailsMenuProps = {
  projectId: string;
  projectColor?: string;
  open: boolean;
  onItemClick: () => void;
  selectedItem: NavItemType;
};
type ProjectDetailsMenuType = React.FC<ProjectDetailsMenuProps>;
