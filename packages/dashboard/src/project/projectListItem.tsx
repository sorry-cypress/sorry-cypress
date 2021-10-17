import { Book } from '@mui/icons-material';
import {
  alpha,
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { ArrayItemType } from '@sorry-cypress/common/ts';
import { GetProjectsQuery } from '@sorry-cypress/dashboard/generated/graphql';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

type ProjectListItemProps = {
  project: ArrayItemType<GetProjectsQuery['projects']>;
  reloadProjects: () => void;
};

export function ProjectListItem({ project }: ProjectListItemProps) {
  return (
    <Link
      component={RouterLink}
      to={`/${project.projectId}/runs`}
      underline="none"
    >
      <Card
        variant="outlined"
        sx={{
          display: 'block',
        }}
      >
        <CardActionArea>
          <CardContent>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    backgroundColor: alpha(
                      project.projectColor || '#3486E3',
                      0.1
                    ),
                  }}
                >
                  <Book sx={{ color: project.projectColor || '#3486E3' }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={decodeURIComponent(project.projectId)}
                primaryTypographyProps={{
                  variant: 'body1',
                }}
              />
            </ListItem>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
