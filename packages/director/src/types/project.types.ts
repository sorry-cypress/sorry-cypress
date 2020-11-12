export type HookType = 'GITHUB_STATUS_HOOK' | 'GENERIC_HOOK';
export type HookEvent =
  | 'RUN_START'
  | 'RUN_FINISH'
  | 'INSTANCE_START'
  | 'INSTANCE_FINISH';
export type Hook = {
  hookId: string;
  url: string;
  headers?: string;
  hookEvents?: HookEvent[];
  hookType: HookType;
  githubToken?: string;
};

export interface Project {
  projectId: string;
  createdAt: string;
  hooks?: Hook[] | null;
}
