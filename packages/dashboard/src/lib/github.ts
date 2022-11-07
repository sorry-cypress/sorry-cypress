export const getGithubCommitURL = (repo: string, sha: string, useSSL: boolean = true) =>
handleURL(repo.replace(/.git$/, '') + `/commit/${sha}`, useSSL);

export const getGithubBranchURL = (repo: string, branch: string, useSSL: boolean = true) =>
handleURL(repo.replace(/.git$/, '') + `/tree/${branch}`, useSSL);

export const handleURL = (Url: string, UseSSL: boolean = true) =>
  Url.replace(/git@([\w.]+):(.+)/, UseSSL ? 'https://$1/$2' : 'http://$1/$2');
