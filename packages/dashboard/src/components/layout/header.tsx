import React from 'react';
import truncate from 'lodash.truncate';
import { Link } from 'react-router-dom';
import { useCss, Breadcrumbs } from 'bold-ui';
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

  return (
    <header
      className={css`
        padding: 32px;
        background-color: ${theme.pallete.gray.c90};
      `}
    >
      <Breadcrumbs>
        <Link to="/?branch=">All Runs</Link>
        {data.navStructure.map((navItem) => (
          <Link key={navItem.link} to={`/${navItem.link}`}>
            {truncate(navItem.label)}
          </Link>
        ))}
      </Breadcrumbs>
    </header>
  );
};
