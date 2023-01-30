import { getRemoteOrigin } from '../utils';

describe('Driver utility functions', () => {
  [
    {
      description: 'git protocol',
      remoteOrigin: 'git@gitlab.com:group/project.git',
      expected: 'https://gitlab.com/group/project.git',
      useSSL: 'true',
    },
    {
      description: 'ssh protocol',
      remoteOrigin: 'ssh@gitlab.com:group/project.git',
      expected: 'https://gitlab.com/group/project.git',
      useuseSSLSSH: 'true',
    },
    {
      description: 'http/s protocol',
      remoteOrigin: 'https://gitlab.com/group/project.git',
      expected: 'https://gitlab.com/group/project.git',
      useSSL: 'true',
    },
    {
      description: 'http/s protocol with token',
      remoteOrigin:
        'https://gitlab-ci-token:token-to-remove@gitlab.com:group/project.git',
      expected: 'https://gitlab.com/group/project.git',
      useSSL: 'true',
    },
    {
      description: 'git protocol',
      remoteOrigin: 'git@gitlab.com:group/project.git',
      expected: 'http://gitlab.com/group/project.git',
      useSSL: 'false',
    },
    {
      description: 'ssh protocol',
      remoteOrigin: 'ssh@gitlab.com:group/project.git',
      expected: 'http://gitlab.com/group/project.git',
      useSSL: 'false',
    },
  ].forEach(({ description, remoteOrigin, expected, useSSL }) => {
    it(`parses remoteOrigin for ${description} correctly`, () => {
      const href = getRemoteOrigin(remoteOrigin, useSSL);
      expect(href).toEqual(expected);
    });
  });
});
