export const getGithubCommitURL = (repo: string, sha: string, useSSL: string = 'true') =>
handleURL(repo.replace(/.git$/, '') + `/commit/${sha}`, useSSL);

export const getGithubBranchURL = (repo: string, branch: string, useSSL: string = 'true') =>
handleURL(repo.replace(/.git$/, '') + `/tree/${branch}`, useSSL);

export const handleURL = (Url: string, UseSSL: string = 'true') =>
  Url.replace(/git@([\w.]+):(.+)/, UseSSL === 'true' ? 'https://$1/$2' : 'http://$1/$2');
