import { useCss } from 'bold-ui';
import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

type HeaderLinkProps = PropsWithChildren<{
  to: string;
}>;

const HeaderLink = ({ to, children }: HeaderLinkProps) => {
  const { css } = useCss();

  return (
    <Link
      className={css`
        vertical-align: middle;
        font-size: 1rem;
        display: block;
        flex: 1;
        padding: 0.5rem 0;
        font-size: 1.25rem;
        text-decoration: none;
      `}
      to={to}
    >
      {children}
    </Link>
  );
};

export { HeaderLink };
