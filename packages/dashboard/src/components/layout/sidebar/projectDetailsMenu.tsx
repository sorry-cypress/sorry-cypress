import {
  PlayLesson as PlayLessonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { InnerListItemMenu } from '@sorry-cypress/dashboard/components/layout/sidebar/innerListItemMenu';
import { NavItemType } from '@sorry-cypress/dashboard/lib/navigation';
import React from 'react';

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
    <>
      {menuItems.map((item) => {
        return (
          <InnerListItemMenu
            key={item.label}
            projectColor={projectColor}
            item={item}
            open={open}
            onItemClick={onItemClick}
            selectedItem={selectedItem}
          ></InnerListItemMenu>
        );
      })}
    </>
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
