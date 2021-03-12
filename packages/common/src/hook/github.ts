export const getGithubStatusUrl = (url: string, sha: string) => {
  const GITHUB_COM_DOMAIN = 'github.com';
  const GITHUB_COM_ENDPOINT = 'api.github.com';

  const [githubProtocol, restOfGithubUrl] = url.split('://');
  const [githubDomain, githubProject, githubRepo] = restOfGithubUrl.split('/');
  const githubEndpoint =
    githubDomain === GITHUB_COM_DOMAIN
      ? GITHUB_COM_ENDPOINT
      : `${githubDomain}/api/v3`;
  return `${githubProtocol}://${githubEndpoint}/repos/${githubProject}/${githubRepo}/statuses/${sha}`;
};
