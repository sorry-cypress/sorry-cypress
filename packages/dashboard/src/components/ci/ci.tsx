import React from 'react';
import { environment } from '@src/state/environment';
import { Icon, Tooltip } from 'bold-ui';

type CiLinkProps = {
  ciBuildId: string | null | undefined;
  projectId: string | null | undefined;
};
export const CiUrl: React.FunctionComponent<CiLinkProps> = ({
  ciBuildId,
  projectId,
}: CiLinkProps) => {
  if (typeof environment.CI_URL !== 'string') {
    return null;
  }

  if (!environment.CI_URL.trim()) {
    return null;
  }

  if (!ciBuildId || !projectId) {
    return null;
  }

  const [name, url] = environment.CI_URL.split(',', 2);
  if (!name || !url) {
    return null;
  }

  const parsedUrl = url
    .replace('{project_id}', projectId)
    .replace('{build_id}', ciBuildId);
  return (
    <div>
      <strong>CI_URL </strong>
      <Tooltip text="Generated from CI_URL env var">
        <Icon size={1} icon="infoCircleOutline" />
      </Tooltip>
      <ul>
        <li>
          <a href={parsedUrl}>{name}</a>
        </li>
      </ul>
    </div>
  );
};
