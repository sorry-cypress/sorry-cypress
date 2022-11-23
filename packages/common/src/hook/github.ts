const GITHUB_COM_DOMAIN = 'github.com';

export const getGithubConfiguration = (url: string) => {
  const [githubProtocol, restOfGithubUrl] = url.split('://');
  const [githubDomain, githubProject, githubRepo] = restOfGithubUrl.split('/');
  const isEnterpriseUrl = githubDomain !== GITHUB_COM_DOMAIN;
  const enterpriseUrl = isEnterpriseUrl
    ? `${githubProtocol}://${githubDomain}/api/v3`
    : undefined;

  return {
    githubDomain,
    githubProject,
    githubRepo,
    githubProtocol,
    isEnterpriseUrl,
    enterpriseUrl,
  };
};
