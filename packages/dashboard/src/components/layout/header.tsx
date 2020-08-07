import React from 'react';
import truncate from 'lodash.truncate';
import { Link } from 'react-router-dom';
import { useCss, Breadcrumbs, Switch, Icon, Tooltip } from 'bold-ui';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const GET_NAV_STRUCTURE = gql`
  {
    navStructure @client {
      label
      link
    }
  }
`;

export const Header: React.FC = () => {
  const { css, theme } = useCss();
  const { data } = useQuery(GET_NAV_STRUCTURE);
  const shouldAutoRefresh = Boolean(JSON.parse(window.localStorage.getItem('shouldAutoRefresh')));
  const lastNavItem = data.navStructure.pop();
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
          {data.navStructure.map(navItem => (
            <Tooltip text={navItem.label} key={navItem.link}>
              <Link to={`/${navItem.link}`}>
                {truncate(navItem.label)}
              </Link>
            </Tooltip>
          ))}
          <span> </span>
        </Breadcrumbs>
      </div>
      <div className={css`flex:1;`}>
        <Tooltip text={lastNavItem?.label}>
          <Link to={`/${lastNavItem?.link}`}>
            {truncate(lastNavItem?.label)}
          </Link>
        </Tooltip>
      </div>
      <Switch label="Auto Refresh" checked={shouldAutoRefresh} onChange={()=>{
        window.localStorage.setItem('shouldAutoRefresh', !shouldAutoRefresh);
        window.location.reload();
      }}/>
      &nbsp;
      <Tooltip text="Toggle polling the api for updates.">
        <Icon
          className={css`align-self: center;`}
          icon="infoCircleOutline"
          size={1}
        />
      </Tooltip>
    </header>
  );
};
