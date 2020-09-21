import { useReactiveVar } from '@apollo/client';
import { useAutoRefresh } from '@src/hooks/useAutoRefresh';
import { navStructure } from '@src/lib/navigation';
import { Breadcrumbs, Icon, Switch, Tooltip, useCss } from 'bold-ui';
import truncate from 'lodash.truncate';
import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { css, theme } = useCss();
  const nav = useReactiveVar(navStructure);
  const [shouldAutoRefresh, setShouldAutoRefresh] = useAutoRefresh();

  const lastNavItem = nav.pop();
  return (
    <header
      className={css`
        padding: 32px;
        background-color: ${theme.pallete.gray.c90};
        display: flex;
      `}
    >
      <div>
        <Breadcrumbs>
          <Link to="/">All Runs</Link>
          {/*breadcrumb removes hover event from the last crumb so the there is a little hackery to get the tooltip working*/}
          {nav.map((navItem) => (
            <Tooltip text={navItem.label} key={navItem.link}>
              <Link to={`/${navItem.link}`}>{truncate(navItem.label)}</Link>
            </Tooltip>
          ))}
          <span> </span>
        </Breadcrumbs>
      </div>
      <div
        className={css`
          flex: 1;
        `}
      >
        <Tooltip text={lastNavItem?.label}>
          <Link to={`/${lastNavItem?.link}`}>
            {truncate(lastNavItem?.label)}
          </Link>
        </Tooltip>
      </div>
      <Switch
        label="Auto Refresh"
        checked={shouldAutoRefresh}
        onChange={() => {
          setShouldAutoRefresh(!shouldAutoRefresh);
          window.location.reload();
        }}
      />
      &nbsp;
      <Tooltip text="Toggle polling the api for updates.">
        <Icon
          className={css`
            align-self: center;
          `}
          icon="infoCircleOutline"
          size={1}
        />
      </Tooltip>
    </header>
  );
};
