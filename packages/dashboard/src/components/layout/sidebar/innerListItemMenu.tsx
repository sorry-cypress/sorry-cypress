import { SvgIconComponent } from '@mui/icons-material';
import {
  alpha,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { NavItemType } from '@sorry-cypress/dashboard/lib/navigation';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const InnerListItemMenu: InnerListItemMenuType = ({
  item,
  projectColor,
  open,
  onItemClick,
  selectedItem,
}) => {
  const selected = selectedItem === item.type;

  return (
    <>
      {open && (
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
            backgroundColor: selected ? 'rgba(255, 255, 255, 0.1)' : undefined,
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
              fontSize: 16,
              color: selected ? 'primary' : 'text.primary',
              sx: { opacity: selected ? 1 : 0.6 },
            }}
          />
        </ListItemButton>
      )}

      {!open && (
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
      )}
    </>
  );
};

type InnerListItemMenuProps = {
  item: {
    label: string;
    link: string;
    iconComponent: SvgIconComponent;
    type: NavItemType;
  };
  projectColor?: string;
  open: boolean;
  onItemClick: () => void;
  selectedItem: NavItemType;
};
type InnerListItemMenuType = React.FC<InnerListItemMenuProps>;
