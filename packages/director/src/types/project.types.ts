export type HookType = 'GITHUB_STATUS_HOOK' | 'GENERIC_HOOK' | 'SLACK_HOOK';
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

export type Hook = SlackHook | GenericHook | GithubHook;

export interface Project {
  projectId: string;
  createdAt: string;
  hooks?: Hook[] | null;
}
