import { PlayLesson as PlayLessonIcon } from '@mui/icons-material';
import { InnerListItemMenu } from '@sorry-cypress/dashboard/components/layout/sidebar/innerListItemMenu';
import { NavItemType } from '@sorry-cypress/dashboard/lib/navigation';
import React from 'react';

export const CiBuildsListMenu: CiBuildsListMenuType = ({
  open,
  onItemClick,
  selectedItem,
}) => {
  const menuItems = [
    {
      label: 'Recent Builds',
      link: `/ci-builds`,
      iconComponent: PlayLessonIcon,
      type: NavItemType.ciBuilds,
    },
  ];
  return (
    <>
      {menuItems.map((item) => {
        return (
          <InnerListItemMenu
            key={item.label}
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

type CiBuildsListMenuProps = {
  open: boolean;
  onItemClick: () => void;
  selectedItem: NavItemType;
};
type CiBuildsListMenuType = React.FC<CiBuildsListMenuProps>;
