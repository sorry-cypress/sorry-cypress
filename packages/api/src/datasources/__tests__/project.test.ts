import { HookType, Project } from '@sorry-cypress/common';
import uuid from 'uuid/v4';
import {
  bitbucketHookFields,
  genericHookFields,
  getCreateProjectValue,
  getUpdateProjectValue,
  githubHookFields,
  slackHookFields,
} from '../projects';

const junkHook = {
  url: uuid(),
  headers: uuid(),
  githubToken: uuid(),
  githubContext: uuid(),
  bitbucketUsername: uuid(),
  bitbucketToken: uuid(),
  bitbucketBuildName: uuid(),
  hookEvents: uuid(),
};

describe('getCreateProjectValue()', () => {
  test('should populate hookIds', async () => {
    const projectInput = {
      projectId: uuid(),
      hooks: [{}],
    };

    expect(getCreateProjectValue(projectInput)).toMatchObject({
      hooks: [
        {
          hookId: expect.any(String),
        },
      ],
    });
  });

  test.each([
    [
      HookType.GITHUB_STATUS_HOOK,
      {
        ...junkHook,
        hookType: HookType.GITHUB_STATUS_HOOK,
      },
      githubHookFields,
    ],
    [
      HookType.GENERIC_HOOK,
      {
        ...junkHook,
        hookType: HookType.GENERIC_HOOK,
      },
      genericHookFields,
    ],
    [
      HookType.BITBUCKET_STATUS_HOOK,
      {
        ...junkHook,
        hookType: HookType.BITBUCKET_STATUS_HOOK,
      },
      bitbucketHookFields,
    ],
    [
      HookType.SLACK_HOOK,
      {
        ...junkHook,
        hookType: HookType.SLACK_HOOK,
      },
      slackHookFields,
    ],
  ])('should retain data for %s', async (_type, input, fields) => {
    const projectInput = {
      projectId: uuid(),
      hooks: [input],
    };
    const result = getCreateProjectValue(projectInput).hooks[0];
    for (const field of fields) {
      expect(result[field]).toEqual(expect.any(String));
    }
  });
});

describe('getUpdateProjectValue()', () => {
  test('should populate hookIds', async () => {
    const projectInput = {
      projectId: uuid(),
      hooks: [{}],
    };

    expect(
      getUpdateProjectValue(projectInput, { hooks: [] } as Project)
    ).toMatchObject({
      hooks: [
        {
          hookId: expect.any(String),
        },
      ],
    });
  });

  test.each([
    [
      HookType.GITHUB_STATUS_HOOK,
      {
        ...junkHook,
        hookType: HookType.GITHUB_STATUS_HOOK,
      },
      githubHookFields,
    ],
    [
      HookType.GENERIC_HOOK,
      {
        ...junkHook,
        hookType: HookType.GENERIC_HOOK,
      },
      genericHookFields,
    ],
    [
      HookType.BITBUCKET_STATUS_HOOK,
      {
        ...junkHook,
        hookType: HookType.BITBUCKET_STATUS_HOOK,
      },
      bitbucketHookFields,
    ],
    [
      HookType.SLACK_HOOK,
      {
        ...junkHook,
        hookType: HookType.SLACK_HOOK,
      },
      slackHookFields,
    ],
  ])('should retain data for %s', async (_type, input, fields) => {
    const projectInput = {
      projectId: uuid(),
      hooks: [input],
    };
    const result = getUpdateProjectValue(projectInput, { hooks: [] } as Project)
      .hooks[0];
    for (const field of fields) {
      expect(result[field]).toEqual(expect.any(String));
    }
  });

  test.each([
    [
      HookType.GITHUB_STATUS_HOOK,
      {
        ...junkHook,
        hookId: 'a',
        hookType: HookType.GITHUB_STATUS_HOOK,
        githubToken: undefined,
      },
      {
        hookId: 'a',
        githubToken: uuid(),
      },
    ],
    [
      HookType.BITBUCKET_STATUS_HOOK,
      {
        ...junkHook,
        hookId: 'a',
        hookType: HookType.BITBUCKET_STATUS_HOOK,
        bitbucketToken: undefined,
        bitbucketUsername: undefined,
      },
      {
        hookId: 'a',
        bitbucketToken: uuid(),
        bitbucketUsername: uuid(),
      },
    ],
  ])('should restore sensitive data for %s', async (_type, input, original) => {
    const projectInput = {
      projectId: uuid(),
      hooks: [input],
    };
    const result = getUpdateProjectValue(projectInput, {
      hooks: [original],
    } as Project).hooks[0];

    expect(result).toMatchObject(original);
  });
});
