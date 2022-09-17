import { Book as BookIcon } from '@mui/icons-material';
import {
  Divider,
  Grid,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const ProjectListMenu: ProjectListMenuType = ({
  projects,
  open,
  onItemClick,
}) => {
  return (
    <Grid mt={1}>
      <Divider />
      {projects?.map((project) => {
        if (open) {
          return (
            <ListItemButton
              key={decodeURIComponent(project.projectId)}
              component={RouterLink}
              to={`/${encodeURIComponent(project.projectId)}/runs`}
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
                to={`/${encodeURIComponent(project.projectId)}/runs`}
                onClick={onItemClick}
                size="large"
              >
                <BookIcon />
              </IconButton>
            </div>
          </Tooltip>
        );
      })}
    </Grid>
  );
};

type ProjectListMenuProps = {
  projects: Array<{ projectId: string; projectColor: string }>;
  open: boolean;
  onItemClick: () => void;
};
type ProjectListMenuType = React.FC<ProjectListMenuProps>;
