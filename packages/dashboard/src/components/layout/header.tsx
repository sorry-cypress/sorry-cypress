import { useReactiveVar } from '@apollo/client';
import { useAutoRefresh } from '@sorry-cypress/dashboard/hooks/useAutoRefresh';
import { navStructure } from '@sorry-cypress/dashboard/lib/navigation';
import { Breadcrumbs, Icon, Switch, Tooltip, useCss } from 'bold-ui';
import { truncate } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
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
          <Link to="/">All Projects</Link>
          {/*breadcrumb removes hover event from the last crumb so the there is a little hackery to get the tooltip working*/}
          {nav.map((navItem) => (
            <Tooltip
              text={decodeURIComponent(navItem.label ?? '')}
              key={navItem.link}
            >
              <Link to={`/${navItem.link}`}>
                {truncate(decodeURIComponent(navItem.label ?? ''))}
              </Link>
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
        <Tooltip text={decodeURIComponent(lastNavItem?.label ?? '')}>
          <Link to={`/${lastNavItem?.link}`}>
            {truncate(decodeURIComponent(lastNavItem?.label ?? ''))}
          </Link>
        </Tooltip>
      </div>
      <Switch
        label="Auto Refresh"
        checked={!!shouldAutoRefresh}
        onChange={() => {
          setShouldAutoRefresh(!shouldAutoRefresh);
          window.location.reload();
        }}
      />
      &nbsp;
      <Tooltip text="Toggle polling for updates">
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
