export type HookEvent =
  | 'RUN_START'
  | 'RUN_FINISH'
  | 'INSTANCE_START'
  | 'INSTANCE_FINISH';

type BaseHook = {
  hookId: string;
  url: string;
};
export type SlackHook = BaseHook & {
  username?: string;
  hookEvents?: HookEvent[];
  hookType: 'SLACK_HOOK';
};
export type GenericHook = BaseHook & {
  headers?: string;
  hookEvents?: HookEvent[];
  hookType: 'GENERIC_HOOK';
};

export type GithubHook = BaseHook & {
  hookType: 'GITHUB_STATUS_HOOK';
  githubToken?: string;
  githubContext?: string;
};

export type Hook = SlackHook | GenericHook | GithubHook | BitbucketHook;

export type BitbucketHook = BaseHook & {
  hookType: 'BITBUCKET_STATUS_HOOK';
  bitbucketUsername: string;
  bitbucketToken?: string;
  bitbucketBuildName?: string;
  bitbucketBuildKey?: string;
};

export interface Project {
  projectId: string;
  createdAt?: string;
  hooks?: Hook[];
}
