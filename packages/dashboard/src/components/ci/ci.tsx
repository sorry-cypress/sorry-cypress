import React from 'react';

type CiLinkProps = {
  ciBuildId: string | null | undefined;
  projectId: string | null | undefined;
  ciUrl: string | null | undefined;
};
export const CiUrl: React.FunctionComponent<CiLinkProps> = ({
  ciBuildId,
  ciUrl,
  projectId,
}: CiLinkProps) => {
  if (!ciBuildId || !ciUrl || !projectId) {
    return null;
  }
  const [name, url] = ciUrl.split(',', 2);
  const parsedUrl = url
    .replace('{project_id}', projectId)
    .replace('{build_id}', ciBuildId);
  return <a href={parsedUrl}>{name}</a>;
};
