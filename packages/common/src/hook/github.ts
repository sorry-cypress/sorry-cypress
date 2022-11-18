export const getGithubConfiguration = (url: string) => {
  const [githubProtocol, restOfGithubUrl] = url.split('://');
  const [githubDomain, githubProject, githubRepo] = restOfGithubUrl.split('/');

  return { githubDomain, githubProject, githubRepo, githubProtocol };
};

export const getGithubStatusUrl = (url: string, sha: string) => {
  const GITHUB_COM_DOMAIN = 'github.com';
  const GITHUB_COM_ENDPOINT = 'api.github.com';

  const {
    githubDomain,
    githubProject,
    githubRepo,
    githubProtocol,
  } = getGithubConfiguration(url);
  const githubEndpoint =
    githubDomain === GITHUB_COM_DOMAIN
      ? GITHUB_COM_ENDPOINT
      : `${githubDomain}/api/v3`;
  return `${githubProtocol}://${githubEndpoint}/repos/${githubProject}/${githubRepo}/statuses/${sha}`;
};
