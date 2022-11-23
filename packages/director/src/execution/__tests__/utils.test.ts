import { getRemoteOrigin } from '../utils';

describe('Driver utility functions', () => {
  [
    {
      description: 'git protocol',
      remoteOrigin: 'git@gitlab.com:group/project.git',
      expected: 'https://gitlab.com/group/project.git',
      useSSH: 'true',
    },
    {
      description: 'ssh protocol',
      remoteOrigin: 'ssh@gitlab.com:group/project.git',
      expected: 'https://gitlab.com/group/project.git',
      useSSH: 'true',
    },
    {
      description: 'http/s protocol',
      remoteOrigin: 'https://gitlab.com/group/project.git',
      expected: 'https://gitlab.com/group/project.git',
      useSSH: 'true',
    },
    {
      description: 'http/s protocol with token',
      remoteOrigin:
        'https://gitlab-ci-token:token-to-remove@gitlab.com:group/project.git',
      expected: 'https://gitlab.com/group/project.git',
      useSSH: 'true',
    },
    {
      description: 'git protocol',
      remoteOrigin: 'git@gitlab.com:group/project.git',
      expected: 'http://gitlab.com/group/project.git',
      useSSH: 'false',
    },
    {
      description: 'ssh protocol',
      remoteOrigin: 'ssh@gitlab.com:group/project.git',
      expected: 'http://gitlab.com/group/project.git',
      useSSH: 'false',
    },
  ].forEach(({ description, remoteOrigin, expected, useSSH }) => {
    it(`parses remoteOrigin for ${description} correctly`, () => {
      const href = getRemoteOrigin(remoteOrigin, useSSH);
      expect(href).toEqual(expected);
    });
  });
});
