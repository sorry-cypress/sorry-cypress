export const getGithubCommitURL = (repo: string, sha: string) =>
  repo.replace(/.git$/, '') + `/commit/${sha}`;

export const getGithubBranchURL = (repo: string, branch: string) =>
  repo.replace(/.git$/, '') + `/tree/${branch}`;
