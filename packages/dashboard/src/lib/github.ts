export const getGithubCommitURL = (repo: string, sha: string) =>
  handleGithubSshURL(repo.replace(/.git$/, '') + `/commit/${sha}`);

export const getGithubBranchURL = (repo: string, branch: string) =>
  handleGithubSshURL(repo.replace(/.git$/, '') + `/tree/${branch}`);

export const handleGithubSshURL = (sshUrl: string) =>
  sshUrl.replace(/git@([\w.]+):(.+)/, 'https://$1/$2');
