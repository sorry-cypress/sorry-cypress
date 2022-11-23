export interface HookEventPayload {
  runId: string;
}

export enum HookType {
  GITHUB_STATUS_HOOK = 'GITHUB_STATUS_HOOK',
  GENERIC_HOOK = 'GENERIC_HOOK',
  SLACK_HOOK = 'SLACK_HOOK',
  BITBUCKET_STATUS_HOOK = 'BITBUCKET_STATUS_HOOK',
  TEAMS_HOOK = 'TEAMS_HOOK',
  GCHAT_HOOK = 'GCHAT_HOOK',
}

export enum HookEvent {
  RUN_START = 'RUN_START',
  RUN_TIMEOUT = 'RUN_TIMEOUT',
  RUN_FINISH = 'RUN_FINISH',
  INSTANCE_START = 'INSTANCE_START',
  INSTANCE_FINISH = 'INSTANCE_FINISH',
}

export enum ResultFilter {
  ALL = 'ALL',
  ONLY_FAILED = 'ONLY_FAILED',
  ONLY_SUCCESSFUL = 'ONLY_SUCCESSFUL',
}

type BaseHook = {
  hookId: string;
  url: string;
};

export type SlackHook = BaseHook & {
  username?: string;
  hookEvents: HookEvent[];
  hookType: HookType.SLACK_HOOK;
  slackResultFilter: ResultFilter | null;
  slackBranchFilter?: string[];
};

export type GenericHook = BaseHook & {
  headers?: string;
  hookEvents: HookEvent[];
  hookType: HookType.GENERIC_HOOK;
};

export type GithubHook = BaseHook & {
  hookType: HookType.GITHUB_STATUS_HOOK;
  githubAuthType?: 'token' | 'app';
  githubToken?: string;
  githubContext?: string;
  githubAppPrivateKey?: string;
  githubAppId?: string;
  githubAppInstallationId?: string;
};

export type BitBucketHook = BaseHook & {
  hookType: HookType.BITBUCKET_STATUS_HOOK;
  bitbucketUsername?: string;
  bitbucketToken?: string;
  bitbucketBuildName?: string;
};

export type TeamsHook = BaseHook & {
  hookEvents: HookEvent[];
  hookType: HookType.TEAMS_HOOK;
};

export type GChatHook = BaseHook & {
  hookEvents: HookEvent[];
  hookType: HookType.GCHAT_HOOK;
};

export type HookWithCustomEvents =
  | SlackHook
  | TeamsHook
  | GenericHook
  | GChatHook;
export type Hook =
  | SlackHook
  | TeamsHook
  | GenericHook
  | GithubHook
  | BitBucketHook
  | GChatHook;
