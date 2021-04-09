import {
  ResultFilter,
  getBitbucketBuildUrl,
  getGithubStatusUrl,
} from '@sorry-cypress/common';

export const bitbucketUrlValidation = (value: string) => {
  try {
    getBitbucketBuildUrl(value, 'fake');
    return true;
  } catch (e) {
    return 'Valid Bitbucket URL required, e.g. https://bitbucket.org/<project>/<repository>.git';
  }
};

export const githubUrlValidation = (value: string) => {
  try {
    getGithubStatusUrl(value, 'fake');
    return true;
  } catch (e) {
    return 'Valid Github URL required, e.g. https://github.com/<org>/<repository>.git';
  }
};

export const jsonValidation = (value: string) => {
  try {
    if (!value) {
      return true;
    }
    JSON.parse(value);
    return true;
  } catch (e) {
    return 'Cannot parse JSON, please enter a valid JSON';
  }
};

export const httpUrlValidation = (value: string) => {
  try {
    const url = new URL(value);
    if (url.protocol && url.hostname && url.pathname) {
      return true;
    }
    return 'Please enter a valid URL';
  } catch (e) {
    return 'Please enter a valid URL';
  }
};

export const slackResultValidation = (value: string) => {
  if (Object.values(ResultFilter).includes(value as ResultFilter)) {
    return true;
  }
  return 'Please select an item';
};
