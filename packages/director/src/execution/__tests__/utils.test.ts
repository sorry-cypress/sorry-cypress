import { getRemoteOrigin } from '../utils';

describe('Driver utility functions', () => {
  [
    {
      description: 'git protocol',
      remoteOrigin: 'git@gitlab.com:group/project.git',
      expected: 'https://gitlab.com/group/project.git',
    },
    {
      description: 'ssh protocol',
      remoteOrigin: 'ssh@gitlab.com:group/project.git',
      expected: 'https://gitlab.com/group/project.git',
    },
    {
      description: 'http/s protocol',
      remoteOrigin: 'https://gitlab.com/group/project.git',
      expected: 'https://gitlab.com/group/project.git',
    },
    {
      description: 'http/s protocol with token',
      remoteOrigin:
        'https://gitlab-ci-token:token-to-remove@gitlab.com:group/project.git',
      expected: 'https://gitlab.com/group/project.git',
    },
  ].forEach(({ description, remoteOrigin, expected }) => {
    it(`parses remoteOrigin for ${description} correctly`, () => {
      const href = getRemoteOrigin(remoteOrigin);
      expect(href).toEqual(expected);
    });
  });
});
