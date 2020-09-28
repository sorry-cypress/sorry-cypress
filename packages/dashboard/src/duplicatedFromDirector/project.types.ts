export type Hook = {
  hookId: string,
  url: string,
  headers: string,
  hookEvents: [string],
  hookType: string
  githubToken: string
}

export interface Project {
  projectId: string;
  createdAt: string;
  hooks?: [Hook];
}
