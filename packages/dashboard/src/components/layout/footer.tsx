import { theme } from '@src/theme/theme';
import { useCss } from 'bold-ui';
import React from 'react';
import { version } from '../../../package.json';

export const Footer = () => {
  const { css } = useCss();
  const contanerStyle = css`
    width: 100%;
    border-top: 1px solid #ccc;
    padding: ${theme.sizes.html}px;
    background: white;

    display: flex;
    justify-content: space-between;
  `;

  const listStyle = css`
    display: flex;
    list-style: none;
    margin: 0;

    li {
      padding-left: 10px;
    }
  `;

  return (
    <div className={contanerStyle}>
      <div>v{version}</div>
      <ul className={listStyle}>
        <li>
          <a
            href="https://github.com/sorry-cypress/sorry-cypress"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
        </li>
        <li>
          <a href="https://sorry-cypress.dev" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </li>
        <li>
          <a
            href="https://github.com/sponsors/agoldis"
            target="_blank"
            rel="noreferrer"
            className={css`
              text-decoration: none;
            `}
          >
            ❤️
          </a>
        </li>
      </ul>
    </div>
  );
};
