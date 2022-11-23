import * as Apollo from '@apollo/client';
import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BitbucketHookType: any;
  DateTime: string;
  GChatHookType: any;
  GenericHookType: any;
  GithubHookType: any;
  SlackHookType: any;
  SlackResultFilter: any;
  TeamsHookType: any;
};

export type BitbucketHook = {
  __typename?: 'BitbucketHook';
  bitbucketBuildName: Maybe<Scalars['String']>;
  bitbucketToken: Maybe<Scalars['String']>;
  bitbucketUsername: Maybe<Scalars['String']>;
  hookId: Scalars['ID'];
  hookType: Scalars['BitbucketHookType'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type CiBuild = {
  __typename?: 'CiBuild';
  ciBuildId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  runs: Array<Run>;
  updatedAt: Maybe<Scalars['DateTime']>;
};

export type Commit = {
  __typename?: 'Commit';
  authorEmail: Maybe<Scalars['String']>;
  authorName: Maybe<Scalars['String']>;
  branch: Maybe<Scalars['String']>;
  message: Maybe<Scalars['String']>;
  remoteOrigin: Maybe<Scalars['String']>;
  sha: Maybe<Scalars['String']>;
};

export type CreateBitbucketHookInput = {
  projectId: Scalars['ID'];
};

export type CreateGChatHookInput = {
  projectId: Scalars['ID'];
};

export type CreateGenericHookInput = {
  projectId: Scalars['ID'];
};

export type CreateGithubHookInput = {
  projectId: Scalars['ID'];
};

export type CreateProjectInput = {
  inactivityTimeoutSeconds: Scalars['Int'];
  projectColor: InputMaybe<Scalars['String']>;
  projectId: Scalars['ID'];
};

export type CreateSlackHookInput = {
  projectId: Scalars['ID'];
  slackResultFilter: InputMaybe<Scalars['SlackResultFilter']>;
};

export type CreateTeamsHookInput = {
  projectId: Scalars['ID'];
};

export type CypressConfig = {
  __typename?: 'CypressConfig';
  video: Scalars['Boolean'];
  videoUploadOnPasses: Scalars['Boolean'];
};

export type DeleteHookInput = {
  hookId: Scalars['ID'];
  projectId: Scalars['String'];
};

export type DeleteHookResponse = {
  __typename?: 'DeleteHookResponse';
  hookId: Scalars['ID'];
  projectId: Scalars['String'];
};

export type DeleteProjectResponse = {
  __typename?: 'DeleteProjectResponse';
  message: Scalars['String'];
  projectIds: Array<Maybe<Scalars['ID']>>;
  success: Scalars['Boolean'];
};

export type DeleteRunResponse = {
  __typename?: 'DeleteRunResponse';
  message: Scalars['String'];
  runIds: Array<Maybe<Scalars['ID']>>;
  success: Scalars['Boolean'];
};

export type Filters = {
  key: InputMaybe<Scalars['String']>;
  like: InputMaybe<Scalars['String']>;
  value: InputMaybe<Scalars['String']>;
};

export type GChatHook = {
  __typename?: 'GChatHook';
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  hookType: Scalars['GChatHookType'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type GenericHook = {
  __typename?: 'GenericHook';
  headers: Maybe<Scalars['String']>;
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  hookType: Scalars['GenericHookType'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type GithubHook = {
  __typename?: 'GithubHook';
  githubAppId: Maybe<Scalars['String']>;
  githubAppInstallationId: Maybe<Scalars['String']>;
  githubAppPrivateKey: Maybe<Scalars['String']>;
  githubAuthType: Maybe<Scalars['String']>;
  githubContext: Maybe<Scalars['String']>;
  githubToken: Maybe<Scalars['String']>;
  hookId: Scalars['ID'];
  hookType: Scalars['GithubHookType'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type Hook = {
  __typename?: 'Hook';
  bitbucketBuildName: Maybe<Scalars['String']>;
  bitbucketToken: Maybe<Scalars['String']>;
  bitbucketUsername: Maybe<Scalars['String']>;
  githubAppId: Maybe<Scalars['String']>;
  githubAppInstallationId: Maybe<Scalars['String']>;
  githubAppPrivateKey: Maybe<Scalars['String']>;
  githubAuthType: Maybe<Scalars['String']>;
  githubContext: Maybe<Scalars['String']>;
  githubToken: Maybe<Scalars['String']>;
  headers: Maybe<Scalars['String']>;
  hookEvents: Maybe<Array<Maybe<Scalars['String']>>>;
  hookId: Maybe<Scalars['String']>;
  hookType: Maybe<Scalars['String']>;
  slackBranchFilter: Maybe<Array<Maybe<Scalars['String']>>>;
  slackResultFilter: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
};

export type HookInput = {
  bitbucketBuildName: InputMaybe<Scalars['String']>;
  bitbucketToken: InputMaybe<Scalars['String']>;
  bitbucketUsername: InputMaybe<Scalars['String']>;
  githubAppId: InputMaybe<Scalars['String']>;
  githubAppInstallationId: InputMaybe<Scalars['String']>;
  githubAppPrivateKey: InputMaybe<Scalars['String']>;
  githubAuthType: InputMaybe<Scalars['String']>;
  githubContext: InputMaybe<Scalars['String']>;
  githubToken: InputMaybe<Scalars['String']>;
  headers: InputMaybe<Scalars['String']>;
  hookEvents: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  hookId: InputMaybe<Scalars['String']>;
  hookType: InputMaybe<Scalars['String']>;
  slackBranchFilter: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  slackResultFilter: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};

export type Instance = {
  __typename?: 'Instance';
  groupId: Scalars['String'];
  instanceId: Scalars['ID'];
  projectId: Scalars['String'];
  results: Maybe<InstanceResults>;
  run: Run;
  runId: Scalars['ID'];
  spec: Scalars['String'];
};

export type InstanceResults = {
  __typename?: 'InstanceResults';
  cypressConfig: Maybe<CypressConfig>;
  error: Maybe<Scalars['String']>;
  reporterStats: Maybe<ReporterStats>;
  screenshots: Array<InstanceScreeshot>;
  stats: InstanceStats;
  stdout: Maybe<Scalars['String']>;
  tests: Maybe<Array<InstanceTest>>;
  videoUrl: Maybe<Scalars['String']>;
};

export type InstanceScreeshot = {
  __typename?: 'InstanceScreeshot';
  height: Scalars['Int'];
  name: Maybe<Scalars['String']>;
  screenshotId: Scalars['String'];
  screenshotURL: Maybe<Scalars['String']>;
  takenAt: Scalars['String'];
  testId: Scalars['String'];
  width: Scalars['Int'];
};

export type InstanceStats = {
  __typename?: 'InstanceStats';
  failures: Scalars['Int'];
  passes: Scalars['Int'];
  pending: Scalars['Int'];
  skipped: Scalars['Int'];
  suites: Scalars['Int'];
  tests: Scalars['Int'];
  wallClockDuration: Scalars['Int'];
  wallClockEndedAt: Scalars['String'];
  wallClockStartedAt: Scalars['String'];
};

export type InstanceTest = {
  __typename?: 'InstanceTest';
  attempts: Array<TestAttempt>;
  body: Maybe<Scalars['String']>;
  displayError: Maybe<Scalars['String']>;
  state: TestState;
  testId: Scalars['String'];
  title: Array<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createBitbucketHook: BitbucketHook;
  createGChatHook: GChatHook;
  createGenericHook: GenericHook;
  createGithubHook: GithubHook;
  createProject: Project;
  createSlackHook: SlackHook;
  createTeamsHook: TeamsHook;
  deleteHook: DeleteHookResponse;
  deleteProject: DeleteProjectResponse;
  deleteRun: DeleteRunResponse;
  deleteRuns: DeleteRunResponse;
  deleteRunsInDateRange: DeleteRunResponse;
  resetInstance: ResetInstanceResponse;
  updateBitbucketHook: BitbucketHook;
  updateGChatHook: GChatHook;
  updateGenericHook: GenericHook;
  updateGithubHook: GithubHook;
  updateProject: Project;
  updateSlackHook: SlackHook;
  updateTeamsHook: TeamsHook;
};

export type MutationCreateBitbucketHookArgs = {
  input: CreateBitbucketHookInput;
};

export type MutationCreateGChatHookArgs = {
  input: CreateGChatHookInput;
};

export type MutationCreateGenericHookArgs = {
  input: CreateGenericHookInput;
};

export type MutationCreateGithubHookArgs = {
  input: CreateGithubHookInput;
};

export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
};

export type MutationCreateSlackHookArgs = {
  input: CreateSlackHookInput;
};

export type MutationCreateTeamsHookArgs = {
  input: CreateTeamsHookInput;
};

export type MutationDeleteHookArgs = {
  input: DeleteHookInput;
};

export type MutationDeleteProjectArgs = {
  projectId: Scalars['ID'];
};

export type MutationDeleteRunArgs = {
  runId: Scalars['ID'];
};

export type MutationDeleteRunsArgs = {
  runIds: Array<InputMaybe<Scalars['ID']>>;
};

export type MutationDeleteRunsInDateRangeArgs = {
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
};

export type MutationResetInstanceArgs = {
  instanceId: Scalars['ID'];
};

export type MutationUpdateBitbucketHookArgs = {
  input: UpdateBitbucketHookInput;
};

export type MutationUpdateGChatHookArgs = {
  input: UpdateGChatHookInput;
};

export type MutationUpdateGenericHookArgs = {
  input: UpdateGenericHookInput;
};

export type MutationUpdateGithubHookArgs = {
  input: UpdateGithubHookInput;
};

export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};

export type MutationUpdateSlackHookArgs = {
  input: UpdateSlackHookInput;
};

export type MutationUpdateTeamsHookArgs = {
  input: UpdateTeamsHookInput;
};

export enum OrderingOptions {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type Project = {
  __typename?: 'Project';
  hooks: Array<Hook>;
  inactivityTimeoutSeconds: Maybe<Scalars['Int']>;
  projectColor: Maybe<Scalars['String']>;
  projectId: Scalars['ID'];
};

export type ProjectInput = {
  hooks: InputMaybe<Array<InputMaybe<HookInput>>>;
  inactivityTimeoutSeconds: InputMaybe<Scalars['Int']>;
  projectColor: InputMaybe<Scalars['String']>;
  projectId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  ciBuilds: Array<Maybe<CiBuild>>;
  instance: Maybe<Instance>;
  project: Maybe<Project>;
  projects: Array<Project>;
  run: Maybe<Run>;
  runFeed: RunFeed;
  runs: Array<Maybe<Run>>;
  specStats: Maybe<SpecStats>;
};

export type QueryCiBuildsArgs = {
  filters?: InputMaybe<Array<InputMaybe<Filters>>>;
};

export type QueryInstanceArgs = {
  id: Scalars['ID'];
};

export type QueryProjectArgs = {
  id: Scalars['ID'];
};

export type QueryProjectsArgs = {
  filters?: InputMaybe<Array<InputMaybe<Filters>>>;
  orderDirection?: InputMaybe<OrderingOptions>;
};

export type QueryRunArgs = {
  id: Scalars['ID'];
};

export type QueryRunFeedArgs = {
  cursor: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<Array<InputMaybe<Filters>>>;
};

export type QueryRunsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<Array<InputMaybe<Filters>>>;
  orderDirection?: InputMaybe<OrderingOptions>;
};

export type QuerySpecStatsArgs = {
  filters?: InputMaybe<Array<InputMaybe<Filters>>>;
  spec: Scalars['String'];
};

export type ReporterStats = {
  __typename?: 'ReporterStats';
  duration: Maybe<Scalars['Int']>;
  end: Maybe<Scalars['String']>;
  failures: Maybe<Scalars['Int']>;
  passes: Maybe<Scalars['Int']>;
  pending: Maybe<Scalars['Int']>;
  start: Maybe<Scalars['String']>;
  suites: Maybe<Scalars['Int']>;
  tests: Maybe<Scalars['Int']>;
};

export type ResetInstanceResponse = {
  __typename?: 'ResetInstanceResponse';
  instanceId: Scalars['ID'];
  message: Scalars['String'];
  success: Maybe<Scalars['Boolean']>;
};

export type Run = {
  __typename?: 'Run';
  completion: Maybe<RunCompletion>;
  createdAt: Scalars['DateTime'];
  meta: RunMeta;
  progress: Maybe<RunProgress>;
  runId: Scalars['ID'];
  specs: Array<RunSpec>;
};

export type RunCompletion = {
  __typename?: 'RunCompletion';
  completed: Scalars['Boolean'];
  inactivityTimeoutMs: Maybe<Scalars['Int']>;
};

export type RunFeed = {
  __typename?: 'RunFeed';
  cursor: Scalars['String'];
  hasMore: Scalars['Boolean'];
  runs: Array<Run>;
};

export type RunGroupProgress = {
  __typename?: 'RunGroupProgress';
  groupId: Scalars['String'];
  instances: RunGroupProgressInstances;
  tests: RunGroupProgressTests;
};

export type RunGroupProgressInstances = {
  __typename?: 'RunGroupProgressInstances';
  claimed: Scalars['Int'];
  complete: Scalars['Int'];
  failures: Scalars['Int'];
  overall: Scalars['Int'];
  passes: Scalars['Int'];
};

export type RunGroupProgressTests = {
  __typename?: 'RunGroupProgressTests';
  failures: Scalars['Int'];
  flaky: Scalars['Int'];
  overall: Scalars['Int'];
  passes: Scalars['Int'];
  pending: Scalars['Int'];
  skipped: Scalars['Int'];
};

export type RunMeta = {
  __typename?: 'RunMeta';
  ciBuildId: Scalars['String'];
  commit: Maybe<Commit>;
  projectId: Scalars['String'];
};

export type RunProgress = {
  __typename?: 'RunProgress';
  groups: Array<RunGroupProgress>;
  updatedAt: Maybe<Scalars['DateTime']>;
};

export type RunSpec = {
  __typename?: 'RunSpec';
  claimedAt: Maybe<Scalars['String']>;
  completedAt: Maybe<Scalars['String']>;
  groupId: Maybe<Scalars['String']>;
  instanceId: Scalars['String'];
  machineId: Maybe<Scalars['String']>;
  results: Maybe<RunSpecResults>;
  spec: Scalars['String'];
};

export type RunSpecResults = {
  __typename?: 'RunSpecResults';
  error: Maybe<Scalars['String']>;
  flaky: Maybe<Scalars['Int']>;
  stats: InstanceStats;
};

export type SlackHook = {
  __typename?: 'SlackHook';
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  hookType: Scalars['SlackHookType'];
  projectId: Scalars['ID'];
  slackBranchFilter: Maybe<Array<Scalars['String']>>;
  slackResultFilter: Maybe<Scalars['SlackResultFilter']>;
  url: Scalars['String'];
};

export type SpecStats = {
  __typename?: 'SpecStats';
  avgWallClockDuration: Scalars['Int'];
  count: Scalars['Int'];
  spec: Scalars['String'];
};

export type TeamsHook = {
  __typename?: 'TeamsHook';
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  hookType: Scalars['TeamsHookType'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type TestAttempt = {
  __typename?: 'TestAttempt';
  error: Maybe<TestError>;
  state: Maybe<Scalars['String']>;
  wallClockDuration: Maybe<Scalars['Int']>;
  wallClockStartedAt: Maybe<Scalars['String']>;
};

export type TestError = {
  __typename?: 'TestError';
  message: Scalars['String'];
  name: Scalars['String'];
  stack: Scalars['String'];
};

export enum TestState {
  Failed = 'failed',
  Passed = 'passed',
  Pending = 'pending',
  Skipped = 'skipped',
}

export type UpdateBitbucketHookInput = {
  bitbucketBuildName: InputMaybe<Scalars['String']>;
  bitbucketToken: InputMaybe<Scalars['String']>;
  bitbucketUsername: Scalars['String'];
  hookId: Scalars['ID'];
  projectId: Scalars['ID'];
  url: InputMaybe<Scalars['String']>;
};

export type UpdateGChatHookInput = {
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type UpdateGenericHookInput = {
  headers: InputMaybe<Scalars['String']>;
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type UpdateGithubHookInput = {
  githubAppId: InputMaybe<Scalars['String']>;
  githubAppInstallationId: InputMaybe<Scalars['String']>;
  githubAppPrivateKey: InputMaybe<Scalars['String']>;
  githubAuthType: InputMaybe<Scalars['String']>;
  githubContext: InputMaybe<Scalars['String']>;
  githubToken: InputMaybe<Scalars['String']>;
  hookId: Scalars['ID'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type UpdateProjectInput = {
  inactivityTimeoutSeconds: Scalars['Int'];
  projectColor: InputMaybe<Scalars['String']>;
  projectId: Scalars['ID'];
};

export type UpdateSlackHookInput = {
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  projectId: Scalars['ID'];
  slackBranchFilter: InputMaybe<Array<Scalars['String']>>;
  slackResultFilter: InputMaybe<Scalars['SlackResultFilter']>;
  url: Scalars['String'];
};

export type UpdateTeamsHookInput = {
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type GetCiBuildsQueryVariables = Exact<{
  filters: Array<Filters> | Filters;
}>;

export type GetCiBuildsQuery = {
  __typename?: 'Query';
  ciBuilds: Array<{
    __typename?: 'CiBuild';
    ciBuildId: string;
    createdAt: string;
    updatedAt: string | null;
    runs: Array<{
      __typename?: 'Run';
      runId: string;
      createdAt: string;
      completion: {
        __typename?: 'RunCompletion';
        completed: boolean;
        inactivityTimeoutMs: number | null;
      } | null;
      meta: {
        __typename?: 'RunMeta';
        ciBuildId: string;
        projectId: string;
        commit: {
          __typename?: 'Commit';
          sha: string | null;
          branch: string | null;
          remoteOrigin: string | null;
          message: string | null;
          authorEmail: string | null;
          authorName: string | null;
        } | null;
      };
      progress: {
        __typename?: 'RunProgress';
        updatedAt: string | null;
        groups: Array<{
          __typename?: 'RunGroupProgress';
          groupId: string;
          instances: {
            __typename?: 'RunGroupProgressInstances';
            overall: number;
            claimed: number;
            complete: number;
            failures: number;
            passes: number;
          };
          tests: {
            __typename?: 'RunGroupProgressTests';
            overall: number;
            passes: number;
            failures: number;
            pending: number;
            skipped: number;
            flaky: number;
          };
        }>;
      } | null;
    }>;
  } | null>;
};

export type GetInstanceQueryVariables = Exact<{
  instanceId: Scalars['ID'];
}>;

export type GetInstanceQuery = {
  __typename?: 'Query';
  instance: {
    __typename?: 'Instance';
    instanceId: string;
    runId: string;
    spec: string;
    projectId: string;
    run: {
      __typename?: 'Run';
      runId: string;
      meta: { __typename?: 'RunMeta'; ciBuildId: string };
    };
    results: {
      __typename?: 'InstanceResults';
      error: string | null;
      videoUrl: string | null;
      stats: {
        __typename?: 'InstanceStats';
        suites: number;
        tests: number;
        pending: number;
        passes: number;
        failures: number;
        skipped: number;
        wallClockDuration: number;
        wallClockStartedAt: string;
        wallClockEndedAt: string;
      };
      tests: Array<{
        __typename?: 'InstanceTest';
        testId: string;
        title: Array<string>;
        state: TestState;
        body: string | null;
        displayError: string | null;
        attempts: Array<{
          __typename?: 'TestAttempt';
          state: string | null;
          wallClockDuration: number | null;
          wallClockStartedAt: string | null;
          error: {
            __typename?: 'TestError';
            name: string;
            message: string;
            stack: string;
          } | null;
        }>;
      }> | null;
      screenshots: Array<{
        __typename?: 'InstanceScreeshot';
        testId: string;
        screenshotId: string;
        height: number;
        width: number;
        screenshotURL: string | null;
      }>;
      cypressConfig: {
        __typename?: 'CypressConfig';
        video: boolean;
        videoUploadOnPasses: boolean;
      } | null;
    } | null;
  } | null;
};

export type GetInstanceTestFragment = {
  __typename?: 'InstanceTest';
  testId: string;
  title: Array<string>;
  state: TestState;
  body: string | null;
  displayError: string | null;
  attempts: Array<{
    __typename?: 'TestAttempt';
    state: string | null;
    wallClockDuration: number | null;
    wallClockStartedAt: string | null;
    error: {
      __typename?: 'TestError';
      name: string;
      message: string;
      stack: string;
    } | null;
  }>;
};

export type CreateProjectMutationVariables = Exact<{
  project: CreateProjectInput;
}>;

export type CreateProjectMutation = {
  __typename?: 'Mutation';
  createProject: {
    __typename?: 'Project';
    projectId: string;
    inactivityTimeoutSeconds: number | null;
    projectColor: string | null;
  };
};

export type DeleteProjectMutationVariables = Exact<{
  projectId: Scalars['ID'];
}>;

export type DeleteProjectMutation = {
  __typename?: 'Mutation';
  deleteProject: {
    __typename?: 'DeleteProjectResponse';
    success: boolean;
    message: string;
    projectIds: Array<string | null>;
  };
};

export type GetProjectQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;

export type GetProjectQuery = {
  __typename?: 'Query';
  project: {
    __typename?: 'Project';
    projectId: string;
    inactivityTimeoutSeconds: number | null;
    projectColor: string | null;
    hooks: Array<{
      __typename?: 'Hook';
      hookId: string | null;
      url: string | null;
      headers: string | null;
      hookEvents: Array<string | null> | null;
      hookType: string | null;
      slackResultFilter: string | null;
      slackBranchFilter: Array<string | null> | null;
      githubAuthType: string | null;
      githubContext: string | null;
      githubToken: string | null;
      githubAppPrivateKey: string | null;
      githubAppId: string | null;
      githubAppInstallationId: string | null;
      bitbucketUsername: string | null;
      bitbucketToken: string | null;
      bitbucketBuildName: string | null;
    }>;
  } | null;
};

export type GetProjectsQueryVariables = Exact<{
  orderDirection: InputMaybe<OrderingOptions>;
  filters: Array<Filters> | Filters;
}>;

export type GetProjectsQuery = {
  __typename?: 'Query';
  projects: Array<{
    __typename?: 'Project';
    projectId: string;
    projectColor: string | null;
  }>;
};

export type CreateBitbucketHookMutationVariables = Exact<{
  input: CreateBitbucketHookInput;
}>;

export type CreateBitbucketHookMutation = {
  __typename?: 'Mutation';
  createBitbucketHook: {
    __typename?: 'BitbucketHook';
    projectId: string;
    hookId: string;
    hookType: any;
    url: string;
    bitbucketUsername: string | null;
    bitbucketBuildName: string | null;
  };
};

export type CreateGChatHookMutationVariables = Exact<{
  input: CreateGChatHookInput;
}>;

export type CreateGChatHookMutation = {
  __typename?: 'Mutation';
  createGChatHook: {
    __typename?: 'GChatHook';
    hookId: string;
    hookType: any;
    url: string;
    hookEvents: Array<string>;
  };
};

export type CreateGenericHookMutationVariables = Exact<{
  input: CreateGenericHookInput;
}>;

export type CreateGenericHookMutation = {
  __typename?: 'Mutation';
  createGenericHook: {
    __typename?: 'GenericHook';
    hookId: string;
    hookType: any;
    url: string;
    hookEvents: Array<string>;
    headers: string | null;
  };
};

export type CreateGithubHookMutationVariables = Exact<{
  input: CreateGithubHookInput;
}>;

export type CreateGithubHookMutation = {
  __typename?: 'Mutation';
  createGithubHook: {
    __typename?: 'GithubHook';
    projectId: string;
    hookId: string;
    hookType: any;
    url: string;
    githubAuthType: string | null;
    githubToken: string | null;
    githubContext: string | null;
    githubAppPrivateKey: string | null;
    githubAppId: string | null;
    githubAppInstallationId: string | null;
  };
};

export type CreateSlackHookMutationVariables = Exact<{
  input: CreateSlackHookInput;
}>;

export type CreateSlackHookMutation = {
  __typename?: 'Mutation';
  createSlackHook: {
    __typename?: 'SlackHook';
    hookId: string;
    hookType: any;
    url: string;
    hookEvents: Array<string>;
    slackResultFilter: any | null;
    slackBranchFilter: Array<string> | null;
  };
};

export type CreateTeamsHookMutationVariables = Exact<{
  input: CreateTeamsHookInput;
}>;

export type CreateTeamsHookMutation = {
  __typename?: 'Mutation';
  createTeamsHook: {
    __typename?: 'TeamsHook';
    hookId: string;
    hookType: any;
    url: string;
    hookEvents: Array<string>;
  };
};

export type DeleteHookMutationVariables = Exact<{
  input: DeleteHookInput;
}>;

export type DeleteHookMutation = {
  __typename?: 'Mutation';
  deleteHook: {
    __typename?: 'DeleteHookResponse';
    hookId: string;
    projectId: string;
  };
};

export type UpdateBitbucketHookMutationVariables = Exact<{
  input: UpdateBitbucketHookInput;
}>;

export type UpdateBitbucketHookMutation = {
  __typename?: 'Mutation';
  updateBitbucketHook: { __typename?: 'BitbucketHook'; hookId: string };
};

export type UpdateGChatHookMutationVariables = Exact<{
  input: UpdateGChatHookInput;
}>;

export type UpdateGChatHookMutation = {
  __typename?: 'Mutation';
  updateGChatHook: { __typename?: 'GChatHook'; hookId: string };
};

export type UpdateGenericHookMutationVariables = Exact<{
  input: UpdateGenericHookInput;
}>;

export type UpdateGenericHookMutation = {
  __typename?: 'Mutation';
  updateGenericHook: { __typename?: 'GenericHook'; hookId: string };
};

export type UpdateGithubHookMutationVariables = Exact<{
  input: UpdateGithubHookInput;
}>;

export type UpdateGithubHookMutation = {
  __typename?: 'Mutation';
  updateGithubHook: { __typename?: 'GithubHook'; hookId: string };
};

export type UpdateSlackHookMutationVariables = Exact<{
  input: UpdateSlackHookInput;
}>;

export type UpdateSlackHookMutation = {
  __typename?: 'Mutation';
  updateSlackHook: { __typename?: 'SlackHook'; hookId: string };
};

export type UpdateTeamsHookMutationVariables = Exact<{
  input: UpdateTeamsHookInput;
}>;

export type UpdateTeamsHookMutation = {
  __typename?: 'Mutation';
  updateTeamsHook: { __typename?: 'TeamsHook'; hookId: string };
};

export type UpdateProjectMutationVariables = Exact<{
  input: UpdateProjectInput;
}>;

export type UpdateProjectMutation = {
  __typename?: 'Mutation';
  updateProject: {
    __typename?: 'Project';
    projectId: string;
    inactivityTimeoutSeconds: number | null;
    projectColor: string | null;
  };
};

export type DeleteRunMutationVariables = Exact<{
  runId: Scalars['ID'];
}>;

export type DeleteRunMutation = {
  __typename?: 'Mutation';
  deleteRun: {
    __typename?: 'DeleteRunResponse';
    success: boolean;
    message: string;
    runIds: Array<string | null>;
  };
};

export type GetSpecStatsQueryVariables = Exact<{
  spec: Scalars['String'];
}>;

export type GetSpecStatsQuery = {
  __typename?: 'Query';
  specStats: {
    __typename?: 'SpecStats';
    spec: string;
    count: number;
    avgWallClockDuration: number;
  } | null;
};

export type GetRunQueryVariables = Exact<{
  runId: Scalars['ID'];
}>;

export type GetRunQuery = {
  __typename?: 'Query';
  run: {
    __typename?: 'Run';
    runId: string;
    createdAt: string;
    completion: {
      __typename?: 'RunCompletion';
      completed: boolean;
      inactivityTimeoutMs: number | null;
    } | null;
    meta: {
      __typename?: 'RunMeta';
      ciBuildId: string;
      projectId: string;
      commit: {
        __typename?: 'Commit';
        sha: string | null;
        branch: string | null;
        remoteOrigin: string | null;
        message: string | null;
        authorEmail: string | null;
        authorName: string | null;
      } | null;
    };
    specs: Array<{
      __typename?: 'RunSpec';
      instanceId: string;
      spec: string;
      claimedAt: string | null;
      machineId: string | null;
      groupId: string | null;
      results: {
        __typename?: 'RunSpecResults';
        error: string | null;
        flaky: number | null;
        stats: {
          __typename?: 'InstanceStats';
          suites: number;
          tests: number;
          pending: number;
          passes: number;
          failures: number;
          skipped: number;
          wallClockDuration: number;
          wallClockStartedAt: string;
          wallClockEndedAt: string;
        };
      } | null;
    }>;
    progress: {
      __typename?: 'RunProgress';
      updatedAt: string | null;
      groups: Array<{
        __typename?: 'RunGroupProgress';
        groupId: string;
        instances: {
          __typename?: 'RunGroupProgressInstances';
          overall: number;
          claimed: number;
          complete: number;
          failures: number;
          passes: number;
        };
        tests: {
          __typename?: 'RunGroupProgressTests';
          overall: number;
          passes: number;
          failures: number;
          pending: number;
          skipped: number;
          flaky: number;
        };
      }>;
    } | null;
  } | null;
};

export type ResetInstanceMutationVariables = Exact<{
  instanceId: Scalars['ID'];
}>;

export type ResetInstanceMutation = {
  __typename?: 'Mutation';
  resetInstance: {
    __typename?: 'ResetInstanceResponse';
    success: boolean | null;
    message: string;
    instanceId: string;
  };
};

export type RunDetailSpecFragment = {
  __typename?: 'RunSpec';
  instanceId: string;
  spec: string;
  claimedAt: string | null;
  machineId: string | null;
  groupId: string | null;
  results: {
    __typename?: 'RunSpecResults';
    error: string | null;
    flaky: number | null;
    stats: {
      __typename?: 'InstanceStats';
      suites: number;
      tests: number;
      pending: number;
      passes: number;
      failures: number;
      skipped: number;
      wallClockDuration: number;
      wallClockStartedAt: string;
      wallClockEndedAt: string;
    };
  } | null;
};

export type AllInstanceStatsFragment = {
  __typename?: 'InstanceStats';
  suites: number;
  tests: number;
  pending: number;
  passes: number;
  failures: number;
  skipped: number;
  wallClockDuration: number;
  wallClockStartedAt: string;
  wallClockEndedAt: string;
};

export type RunSummaryCompletionFragment = {
  __typename?: 'RunCompletion';
  completed: boolean;
  inactivityTimeoutMs: number | null;
};

export type RunSummaryMetaFragment = {
  __typename?: 'RunMeta';
  ciBuildId: string;
  projectId: string;
  commit: {
    __typename?: 'Commit';
    sha: string | null;
    branch: string | null;
    remoteOrigin: string | null;
    message: string | null;
    authorEmail: string | null;
    authorName: string | null;
  } | null;
};

export type RunSummarySpecFragment = {
  __typename?: 'RunSpec';
  claimedAt: string | null;
  results: {
    __typename?: 'RunSpecResults';
    stats: {
      __typename?: 'InstanceStats';
      suites: number;
      tests: number;
      pending: number;
      passes: number;
      failures: number;
      skipped: number;
      wallClockDuration: number;
      wallClockStartedAt: string;
      wallClockEndedAt: string;
    };
  } | null;
};

export type GetRunsFeedQueryVariables = Exact<{
  cursor: InputMaybe<Scalars['String']>;
  filters: Array<Filters> | Filters;
}>;

export type GetRunsFeedQuery = {
  __typename?: 'Query';
  runFeed: {
    __typename?: 'RunFeed';
    cursor: string;
    hasMore: boolean;
    runs: Array<{
      __typename?: 'Run';
      runId: string;
      createdAt: string;
      completion: {
        __typename?: 'RunCompletion';
        completed: boolean;
        inactivityTimeoutMs: number | null;
      } | null;
      meta: {
        __typename?: 'RunMeta';
        ciBuildId: string;
        projectId: string;
        commit: {
          __typename?: 'Commit';
          sha: string | null;
          branch: string | null;
          remoteOrigin: string | null;
          message: string | null;
          authorEmail: string | null;
          authorName: string | null;
        } | null;
      };
      progress: {
        __typename?: 'RunProgress';
        updatedAt: string | null;
        groups: Array<{
          __typename?: 'RunGroupProgress';
          groupId: string;
          instances: {
            __typename?: 'RunGroupProgressInstances';
            overall: number;
            claimed: number;
            complete: number;
            failures: number;
            passes: number;
          };
          tests: {
            __typename?: 'RunGroupProgressTests';
            overall: number;
            passes: number;
            failures: number;
            pending: number;
            skipped: number;
            flaky: number;
          };
        }>;
      } | null;
    }>;
  };
};

export type RunProgressFragment = {
  __typename?: 'RunProgress';
  updatedAt: string | null;
  groups: Array<{
    __typename?: 'RunGroupProgress';
    groupId: string;
    instances: {
      __typename?: 'RunGroupProgressInstances';
      overall: number;
      claimed: number;
      complete: number;
      failures: number;
      passes: number;
    };
    tests: {
      __typename?: 'RunGroupProgressTests';
      overall: number;
      passes: number;
      failures: number;
      pending: number;
      skipped: number;
      flaky: number;
    };
  }>;
};

export type RunGroupProgressInstancesFragment = {
  __typename?: 'RunGroupProgressInstances';
  overall: number;
  claimed: number;
  complete: number;
  failures: number;
  passes: number;
};

export type RunGroupProgressTestsFragment = {
  __typename?: 'RunGroupProgressTests';
  overall: number;
  passes: number;
  failures: number;
  pending: number;
  skipped: number;
  flaky: number;
};

export const GetInstanceTestFragmentDoc = gql`
  fragment GetInstanceTest on InstanceTest {
    testId
    title
    state
    body
    displayError
    attempts {
      state
      wallClockDuration
      wallClockStartedAt
      error {
        name
        message
        stack
      }
    }
  }
`;
export const AllInstanceStatsFragmentDoc = gql`
  fragment AllInstanceStats on InstanceStats {
    suites
    tests
    pending
    passes
    failures
    skipped
    suites
    wallClockDuration
    wallClockStartedAt
    wallClockEndedAt
  }
`;
export const RunDetailSpecFragmentDoc = gql`
  fragment RunDetailSpec on RunSpec {
    instanceId
    spec
    claimedAt
    machineId
    groupId
    results {
      error
      flaky
      stats {
        ...AllInstanceStats
      }
    }
  }
  ${AllInstanceStatsFragmentDoc}
`;
export const RunSummaryCompletionFragmentDoc = gql`
  fragment RunSummaryCompletion on RunCompletion {
    completed
    inactivityTimeoutMs
  }
`;
export const RunSummaryMetaFragmentDoc = gql`
  fragment RunSummaryMeta on RunMeta {
    ciBuildId
    projectId
    commit {
      sha
      branch
      remoteOrigin
      message
      authorEmail
      authorName
    }
  }
`;
export const RunSummarySpecFragmentDoc = gql`
  fragment RunSummarySpec on RunSpec {
    claimedAt
    results {
      stats {
        ...AllInstanceStats
      }
    }
  }
  ${AllInstanceStatsFragmentDoc}
`;
export const RunGroupProgressInstancesFragmentDoc = gql`
  fragment RunGroupProgressInstances on RunGroupProgressInstances {
    overall
    claimed
    complete
    failures
    passes
  }
`;
export const RunGroupProgressTestsFragmentDoc = gql`
  fragment RunGroupProgressTests on RunGroupProgressTests {
    overall
    passes
    failures
    pending
    skipped
    flaky
  }
`;
export const RunProgressFragmentDoc = gql`
  fragment RunProgress on RunProgress {
    updatedAt
    groups {
      groupId
      instances {
        ...RunGroupProgressInstances
      }
      tests {
        ...RunGroupProgressTests
      }
    }
  }
  ${RunGroupProgressInstancesFragmentDoc}
  ${RunGroupProgressTestsFragmentDoc}
`;
export const GetCiBuildsDocument = gql`
  query getCiBuilds($filters: [Filters!]!) {
    ciBuilds(filters: $filters) {
      ciBuildId
      runs {
        runId
        createdAt
        completion {
          ...RunSummaryCompletion
        }
        meta {
          ...RunSummaryMeta
        }
        progress {
          ...RunProgress
        }
      }
      createdAt
      updatedAt
    }
  }
  ${RunSummaryCompletionFragmentDoc}
  ${RunSummaryMetaFragmentDoc}
  ${RunProgressFragmentDoc}
`;

/**
 * __useGetCiBuildsQuery__
 *
 * To run a query within a React component, call `useGetCiBuildsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCiBuildsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCiBuildsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetCiBuildsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCiBuildsQuery,
    GetCiBuildsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCiBuildsQuery, GetCiBuildsQueryVariables>(
    GetCiBuildsDocument,
    options
  );
}
export function useGetCiBuildsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCiBuildsQuery,
    GetCiBuildsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCiBuildsQuery, GetCiBuildsQueryVariables>(
    GetCiBuildsDocument,
    options
  );
}
export type GetCiBuildsQueryHookResult = ReturnType<typeof useGetCiBuildsQuery>;
export type GetCiBuildsLazyQueryHookResult = ReturnType<
  typeof useGetCiBuildsLazyQuery
>;
export type GetCiBuildsQueryResult = Apollo.QueryResult<
  GetCiBuildsQuery,
  GetCiBuildsQueryVariables
>;
export const GetInstanceDocument = gql`
  query getInstance($instanceId: ID!) {
    instance(id: $instanceId) {
      instanceId
      runId
      spec
      projectId
      run {
        runId
        meta {
          ciBuildId
        }
      }
      results {
        error
        stats {
          ...AllInstanceStats
        }
        tests {
          ...GetInstanceTest
        }
        screenshots {
          testId
          screenshotId
          height
          width
          screenshotURL
        }
        cypressConfig {
          video
          videoUploadOnPasses
        }
        videoUrl
      }
    }
  }
  ${AllInstanceStatsFragmentDoc}
  ${GetInstanceTestFragmentDoc}
`;

/**
 * __useGetInstanceQuery__
 *
 * To run a query within a React component, call `useGetInstanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInstanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInstanceQuery({
 *   variables: {
 *      instanceId: // value for 'instanceId'
 *   },
 * });
 */
export function useGetInstanceQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetInstanceQuery,
    GetInstanceQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetInstanceQuery, GetInstanceQueryVariables>(
    GetInstanceDocument,
    options
  );
}
export function useGetInstanceLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetInstanceQuery,
    GetInstanceQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetInstanceQuery, GetInstanceQueryVariables>(
    GetInstanceDocument,
    options
  );
}
export type GetInstanceQueryHookResult = ReturnType<typeof useGetInstanceQuery>;
export type GetInstanceLazyQueryHookResult = ReturnType<
  typeof useGetInstanceLazyQuery
>;
export type GetInstanceQueryResult = Apollo.QueryResult<
  GetInstanceQuery,
  GetInstanceQueryVariables
>;
export const CreateProjectDocument = gql`
  mutation createProject($project: CreateProjectInput!) {
    createProject(project: $project) {
      projectId
      inactivityTimeoutSeconds
      projectColor
    }
  }
`;
export type CreateProjectMutationFn = Apollo.MutationFunction<
  CreateProjectMutation,
  CreateProjectMutationVariables
>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      project: // value for 'project'
 *   },
 * });
 */
export function useCreateProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >(CreateProjectDocument, options);
}
export type CreateProjectMutationHookResult = ReturnType<
  typeof useCreateProjectMutation
>;
export type CreateProjectMutationResult = Apollo.MutationResult<
  CreateProjectMutation
>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<
  CreateProjectMutation,
  CreateProjectMutationVariables
>;
export const DeleteProjectDocument = gql`
  mutation deleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId) {
      success
      message
      projectIds
    }
  }
`;
export type DeleteProjectMutationFn = Apollo.MutationFunction<
  DeleteProjectMutation,
  DeleteProjectMutationVariables
>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useDeleteProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteProjectMutation,
    DeleteProjectMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteProjectMutation,
    DeleteProjectMutationVariables
  >(DeleteProjectDocument, options);
}
export type DeleteProjectMutationHookResult = ReturnType<
  typeof useDeleteProjectMutation
>;
export type DeleteProjectMutationResult = Apollo.MutationResult<
  DeleteProjectMutation
>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<
  DeleteProjectMutation,
  DeleteProjectMutationVariables
>;
export const GetProjectDocument = gql`
  query getProject($projectId: ID!) {
    project(id: $projectId) {
      projectId
      inactivityTimeoutSeconds
      projectColor
      hooks {
        hookId
        url
        headers
        hookEvents
        hookType
        slackResultFilter
        slackBranchFilter
        githubAuthType
        githubContext
        githubToken
        githubAppPrivateKey
        githubAppId
        githubAppInstallationId
        bitbucketUsername
        bitbucketToken
        bitbucketBuildName
      }
    }
  }
`;

/**
 * __useGetProjectQuery__
 *
 * To run a query within a React component, call `useGetProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetProjectQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetProjectQuery,
    GetProjectQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProjectQuery, GetProjectQueryVariables>(
    GetProjectDocument,
    options
  );
}
export function useGetProjectLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProjectQuery,
    GetProjectQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProjectQuery, GetProjectQueryVariables>(
    GetProjectDocument,
    options
  );
}
export type GetProjectQueryHookResult = ReturnType<typeof useGetProjectQuery>;
export type GetProjectLazyQueryHookResult = ReturnType<
  typeof useGetProjectLazyQuery
>;
export type GetProjectQueryResult = Apollo.QueryResult<
  GetProjectQuery,
  GetProjectQueryVariables
>;
export const GetProjectsDocument = gql`
  query getProjects($orderDirection: OrderingOptions, $filters: [Filters!]!) {
    projects(orderDirection: $orderDirection, filters: $filters) {
      projectId
      projectColor
    }
  }
`;

/**
 * __useGetProjectsQuery__
 *
 * To run a query within a React component, call `useGetProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsQuery({
 *   variables: {
 *      orderDirection: // value for 'orderDirection'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetProjectsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetProjectsQuery,
    GetProjectsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(
    GetProjectsDocument,
    options
  );
}
export function useGetProjectsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProjectsQuery,
    GetProjectsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(
    GetProjectsDocument,
    options
  );
}
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<
  typeof useGetProjectsLazyQuery
>;
export type GetProjectsQueryResult = Apollo.QueryResult<
  GetProjectsQuery,
  GetProjectsQueryVariables
>;
export const CreateBitbucketHookDocument = gql`
  mutation createBitbucketHook($input: CreateBitbucketHookInput!) {
    createBitbucketHook(input: $input) {
      projectId
      hookId
      hookType
      url
      bitbucketUsername
      bitbucketBuildName
    }
  }
`;
export type CreateBitbucketHookMutationFn = Apollo.MutationFunction<
  CreateBitbucketHookMutation,
  CreateBitbucketHookMutationVariables
>;

/**
 * __useCreateBitbucketHookMutation__
 *
 * To run a mutation, you first call `useCreateBitbucketHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBitbucketHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBitbucketHookMutation, { data, loading, error }] = useCreateBitbucketHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateBitbucketHookMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateBitbucketHookMutation,
    CreateBitbucketHookMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateBitbucketHookMutation,
    CreateBitbucketHookMutationVariables
  >(CreateBitbucketHookDocument, options);
}
export type CreateBitbucketHookMutationHookResult = ReturnType<
  typeof useCreateBitbucketHookMutation
>;
export type CreateBitbucketHookMutationResult = Apollo.MutationResult<
  CreateBitbucketHookMutation
>;
export type CreateBitbucketHookMutationOptions = Apollo.BaseMutationOptions<
  CreateBitbucketHookMutation,
  CreateBitbucketHookMutationVariables
>;
export const CreateGChatHookDocument = gql`
  mutation createGChatHook($input: CreateGChatHookInput!) {
    createGChatHook(input: $input) {
      hookId
      hookType
      url
      hookEvents
    }
  }
`;
export type CreateGChatHookMutationFn = Apollo.MutationFunction<
  CreateGChatHookMutation,
  CreateGChatHookMutationVariables
>;

/**
 * __useCreateGChatHookMutation__
 *
 * To run a mutation, you first call `useCreateGChatHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGChatHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGChatHookMutation, { data, loading, error }] = useCreateGChatHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGChatHookMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateGChatHookMutation,
    CreateGChatHookMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateGChatHookMutation,
    CreateGChatHookMutationVariables
  >(CreateGChatHookDocument, options);
}
export type CreateGChatHookMutationHookResult = ReturnType<
  typeof useCreateGChatHookMutation
>;
export type CreateGChatHookMutationResult = Apollo.MutationResult<
  CreateGChatHookMutation
>;
export type CreateGChatHookMutationOptions = Apollo.BaseMutationOptions<
  CreateGChatHookMutation,
  CreateGChatHookMutationVariables
>;
export const CreateGenericHookDocument = gql`
  mutation createGenericHook($input: CreateGenericHookInput!) {
    createGenericHook(input: $input) {
      hookId
      hookType
      url
      hookEvents
      headers
    }
  }
`;
export type CreateGenericHookMutationFn = Apollo.MutationFunction<
  CreateGenericHookMutation,
  CreateGenericHookMutationVariables
>;

/**
 * __useCreateGenericHookMutation__
 *
 * To run a mutation, you first call `useCreateGenericHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGenericHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGenericHookMutation, { data, loading, error }] = useCreateGenericHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGenericHookMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateGenericHookMutation,
    CreateGenericHookMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateGenericHookMutation,
    CreateGenericHookMutationVariables
  >(CreateGenericHookDocument, options);
}
export type CreateGenericHookMutationHookResult = ReturnType<
  typeof useCreateGenericHookMutation
>;
export type CreateGenericHookMutationResult = Apollo.MutationResult<
  CreateGenericHookMutation
>;
export type CreateGenericHookMutationOptions = Apollo.BaseMutationOptions<
  CreateGenericHookMutation,
  CreateGenericHookMutationVariables
>;
export const CreateGithubHookDocument = gql`
  mutation createGithubHook($input: CreateGithubHookInput!) {
    createGithubHook(input: $input) {
      projectId
      hookId
      hookType
      url
      githubAuthType
      githubToken
      githubContext
      githubAppPrivateKey
      githubAppId
      githubAppInstallationId
    }
  }
`;
export type CreateGithubHookMutationFn = Apollo.MutationFunction<
  CreateGithubHookMutation,
  CreateGithubHookMutationVariables
>;

/**
 * __useCreateGithubHookMutation__
 *
 * To run a mutation, you first call `useCreateGithubHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGithubHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGithubHookMutation, { data, loading, error }] = useCreateGithubHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGithubHookMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateGithubHookMutation,
    CreateGithubHookMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateGithubHookMutation,
    CreateGithubHookMutationVariables
  >(CreateGithubHookDocument, options);
}
export type CreateGithubHookMutationHookResult = ReturnType<
  typeof useCreateGithubHookMutation
>;
export type CreateGithubHookMutationResult = Apollo.MutationResult<
  CreateGithubHookMutation
>;
export type CreateGithubHookMutationOptions = Apollo.BaseMutationOptions<
  CreateGithubHookMutation,
  CreateGithubHookMutationVariables
>;
export const CreateSlackHookDocument = gql`
  mutation createSlackHook($input: CreateSlackHookInput!) {
    createSlackHook(input: $input) {
      hookId
      hookType
      url
      hookEvents
      slackResultFilter
      slackBranchFilter
    }
  }
`;
export type CreateSlackHookMutationFn = Apollo.MutationFunction<
  CreateSlackHookMutation,
  CreateSlackHookMutationVariables
>;

/**
 * __useCreateSlackHookMutation__
 *
 * To run a mutation, you first call `useCreateSlackHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSlackHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSlackHookMutation, { data, loading, error }] = useCreateSlackHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSlackHookMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateSlackHookMutation,
    CreateSlackHookMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateSlackHookMutation,
    CreateSlackHookMutationVariables
  >(CreateSlackHookDocument, options);
}
export type CreateSlackHookMutationHookResult = ReturnType<
  typeof useCreateSlackHookMutation
>;
export type CreateSlackHookMutationResult = Apollo.MutationResult<
  CreateSlackHookMutation
>;
export type CreateSlackHookMutationOptions = Apollo.BaseMutationOptions<
  CreateSlackHookMutation,
  CreateSlackHookMutationVariables
>;
export const CreateTeamsHookDocument = gql`
  mutation createTeamsHook($input: CreateTeamsHookInput!) {
    createTeamsHook(input: $input) {
      hookId
      hookType
      url
      hookEvents
    }
  }
`;
export type CreateTeamsHookMutationFn = Apollo.MutationFunction<
  CreateTeamsHookMutation,
  CreateTeamsHookMutationVariables
>;

/**
 * __useCreateTeamsHookMutation__
 *
 * To run a mutation, you first call `useCreateTeamsHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeamsHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeamsHookMutation, { data, loading, error }] = useCreateTeamsHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTeamsHookMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateTeamsHookMutation,
    CreateTeamsHookMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateTeamsHookMutation,
    CreateTeamsHookMutationVariables
  >(CreateTeamsHookDocument, options);
}
export type CreateTeamsHookMutationHookResult = ReturnType<
  typeof useCreateTeamsHookMutation
>;
export type CreateTeamsHookMutationResult = Apollo.MutationResult<
  CreateTeamsHookMutation
>;
export type CreateTeamsHookMutationOptions = Apollo.BaseMutationOptions<
  CreateTeamsHookMutation,
  CreateTeamsHookMutationVariables
>;
export const DeleteHookDocument = gql`
  mutation deleteHook($input: DeleteHookInput!) {
    deleteHook(input: $input) {
      hookId
      projectId
    }
  }
`;
export type DeleteHookMutationFn = Apollo.MutationFunction<
  DeleteHookMutation,
  DeleteHookMutationVariables
>;

/**
 * __useDeleteHookMutation__
 *
 * To run a mutation, you first call `useDeleteHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteHookMutation, { data, loading, error }] = useDeleteHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteHookMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteHookMutation,
    DeleteHookMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteHookMutation, DeleteHookMutationVariables>(
    DeleteHookDocument,
    options
  );
}
export type DeleteHookMutationHookResult = ReturnType<
  typeof useDeleteHookMutation
>;
export type DeleteHookMutationResult = Apollo.MutationResult<
  DeleteHookMutation
>;
export type DeleteHookMutationOptions = Apollo.BaseMutationOptions<
  DeleteHookMutation,
  DeleteHookMutationVariables
>;
export const UpdateBitbucketHookDocument = gql`
  mutation updateBitbucketHook($input: UpdateBitbucketHookInput!) {
    updateBitbucketHook(input: $input) {
      hookId
    }
  }
`;
export type UpdateBitbucketHookMutationFn = Apollo.MutationFunction<
  UpdateBitbucketHookMutation,
  UpdateBitbucketHookMutationVariables
>;

/**
 * __useUpdateBitbucketHookMutation__
 *
 * To run a mutation, you first call `useUpdateBitbucketHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBitbucketHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBitbucketHookMutation, { data, loading, error }] = useUpdateBitbucketHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateBitbucketHookMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateBitbucketHookMutation,
    UpdateBitbucketHookMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateBitbucketHookMutation,
    UpdateBitbucketHookMutationVariables
  >(UpdateBitbucketHookDocument, options);
}
export type UpdateBitbucketHookMutationHookResult = ReturnType<
  typeof useUpdateBitbucketHookMutation
>;
export type UpdateBitbucketHookMutationResult = Apollo.MutationResult<
  UpdateBitbucketHookMutation
>;
export type UpdateBitbucketHookMutationOptions = Apollo.BaseMutationOptions<
  UpdateBitbucketHookMutation,
  UpdateBitbucketHookMutationVariables
>;
export const UpdateGChatHookDocument = gql`
  mutation updateGChatHook($input: UpdateGChatHookInput!) {
    updateGChatHook(input: $input) {
      hookId
    }
  }
`;
export type UpdateGChatHookMutationFn = Apollo.MutationFunction<
  UpdateGChatHookMutation,
  UpdateGChatHookMutationVariables
>;

/**
 * __useUpdateGChatHookMutation__
 *
 * To run a mutation, you first call `useUpdateGChatHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGChatHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGChatHookMutation, { data, loading, error }] = useUpdateGChatHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateGChatHookMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateGChatHookMutation,
    UpdateGChatHookMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateGChatHookMutation,
    UpdateGChatHookMutationVariables
  >(UpdateGChatHookDocument, options);
}
export type UpdateGChatHookMutationHookResult = ReturnType<
  typeof useUpdateGChatHookMutation
>;
export type UpdateGChatHookMutationResult = Apollo.MutationResult<
  UpdateGChatHookMutation
>;
export type UpdateGChatHookMutationOptions = Apollo.BaseMutationOptions<
  UpdateGChatHookMutation,
  UpdateGChatHookMutationVariables
>;
export const UpdateGenericHookDocument = gql`
  mutation updateGenericHook($input: UpdateGenericHookInput!) {
    updateGenericHook(input: $input) {
      hookId
    }
  }
`;
export type UpdateGenericHookMutationFn = Apollo.MutationFunction<
  UpdateGenericHookMutation,
  UpdateGenericHookMutationVariables
>;

/**
 * __useUpdateGenericHookMutation__
 *
 * To run a mutation, you first call `useUpdateGenericHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGenericHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGenericHookMutation, { data, loading, error }] = useUpdateGenericHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateGenericHookMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateGenericHookMutation,
    UpdateGenericHookMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateGenericHookMutation,
    UpdateGenericHookMutationVariables
  >(UpdateGenericHookDocument, options);
}
export type UpdateGenericHookMutationHookResult = ReturnType<
  typeof useUpdateGenericHookMutation
>;
export type UpdateGenericHookMutationResult = Apollo.MutationResult<
  UpdateGenericHookMutation
>;
export type UpdateGenericHookMutationOptions = Apollo.BaseMutationOptions<
  UpdateGenericHookMutation,
  UpdateGenericHookMutationVariables
>;
export const UpdateGithubHookDocument = gql`
  mutation updateGithubHook($input: UpdateGithubHookInput!) {
    updateGithubHook(input: $input) {
      hookId
    }
  }
`;
export type UpdateGithubHookMutationFn = Apollo.MutationFunction<
  UpdateGithubHookMutation,
  UpdateGithubHookMutationVariables
>;

/**
 * __useUpdateGithubHookMutation__
 *
 * To run a mutation, you first call `useUpdateGithubHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGithubHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGithubHookMutation, { data, loading, error }] = useUpdateGithubHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateGithubHookMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateGithubHookMutation,
    UpdateGithubHookMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateGithubHookMutation,
    UpdateGithubHookMutationVariables
  >(UpdateGithubHookDocument, options);
}
export type UpdateGithubHookMutationHookResult = ReturnType<
  typeof useUpdateGithubHookMutation
>;
export type UpdateGithubHookMutationResult = Apollo.MutationResult<
  UpdateGithubHookMutation
>;
export type UpdateGithubHookMutationOptions = Apollo.BaseMutationOptions<
  UpdateGithubHookMutation,
  UpdateGithubHookMutationVariables
>;
export const UpdateSlackHookDocument = gql`
  mutation updateSlackHook($input: UpdateSlackHookInput!) {
    updateSlackHook(input: $input) {
      hookId
    }
  }
`;
export type UpdateSlackHookMutationFn = Apollo.MutationFunction<
  UpdateSlackHookMutation,
  UpdateSlackHookMutationVariables
>;

/**
 * __useUpdateSlackHookMutation__
 *
 * To run a mutation, you first call `useUpdateSlackHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSlackHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSlackHookMutation, { data, loading, error }] = useUpdateSlackHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSlackHookMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateSlackHookMutation,
    UpdateSlackHookMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateSlackHookMutation,
    UpdateSlackHookMutationVariables
  >(UpdateSlackHookDocument, options);
}
export type UpdateSlackHookMutationHookResult = ReturnType<
  typeof useUpdateSlackHookMutation
>;
export type UpdateSlackHookMutationResult = Apollo.MutationResult<
  UpdateSlackHookMutation
>;
export type UpdateSlackHookMutationOptions = Apollo.BaseMutationOptions<
  UpdateSlackHookMutation,
  UpdateSlackHookMutationVariables
>;
export const UpdateTeamsHookDocument = gql`
  mutation updateTeamsHook($input: UpdateTeamsHookInput!) {
    updateTeamsHook(input: $input) {
      hookId
    }
  }
`;
export type UpdateTeamsHookMutationFn = Apollo.MutationFunction<
  UpdateTeamsHookMutation,
  UpdateTeamsHookMutationVariables
>;

/**
 * __useUpdateTeamsHookMutation__
 *
 * To run a mutation, you first call `useUpdateTeamsHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTeamsHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTeamsHookMutation, { data, loading, error }] = useUpdateTeamsHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTeamsHookMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateTeamsHookMutation,
    UpdateTeamsHookMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateTeamsHookMutation,
    UpdateTeamsHookMutationVariables
  >(UpdateTeamsHookDocument, options);
}
export type UpdateTeamsHookMutationHookResult = ReturnType<
  typeof useUpdateTeamsHookMutation
>;
export type UpdateTeamsHookMutationResult = Apollo.MutationResult<
  UpdateTeamsHookMutation
>;
export type UpdateTeamsHookMutationOptions = Apollo.BaseMutationOptions<
  UpdateTeamsHookMutation,
  UpdateTeamsHookMutationVariables
>;
export const UpdateProjectDocument = gql`
  mutation updateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      projectId
      inactivityTimeoutSeconds
      projectColor
    }
  }
`;
export type UpdateProjectMutationFn = Apollo.MutationFunction<
  UpdateProjectMutation,
  UpdateProjectMutationVariables
>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateProjectMutation,
    UpdateProjectMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateProjectMutation,
    UpdateProjectMutationVariables
  >(UpdateProjectDocument, options);
}
export type UpdateProjectMutationHookResult = ReturnType<
  typeof useUpdateProjectMutation
>;
export type UpdateProjectMutationResult = Apollo.MutationResult<
  UpdateProjectMutation
>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<
  UpdateProjectMutation,
  UpdateProjectMutationVariables
>;
export const DeleteRunDocument = gql`
  mutation deleteRun($runId: ID!) {
    deleteRun(runId: $runId) {
      success
      message
      runIds
    }
  }
`;
export type DeleteRunMutationFn = Apollo.MutationFunction<
  DeleteRunMutation,
  DeleteRunMutationVariables
>;

/**
 * __useDeleteRunMutation__
 *
 * To run a mutation, you first call `useDeleteRunMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRunMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRunMutation, { data, loading, error }] = useDeleteRunMutation({
 *   variables: {
 *      runId: // value for 'runId'
 *   },
 * });
 */
export function useDeleteRunMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteRunMutation,
    DeleteRunMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteRunMutation, DeleteRunMutationVariables>(
    DeleteRunDocument,
    options
  );
}
export type DeleteRunMutationHookResult = ReturnType<
  typeof useDeleteRunMutation
>;
export type DeleteRunMutationResult = Apollo.MutationResult<DeleteRunMutation>;
export type DeleteRunMutationOptions = Apollo.BaseMutationOptions<
  DeleteRunMutation,
  DeleteRunMutationVariables
>;
export const GetSpecStatsDocument = gql`
  query getSpecStats($spec: String!) {
    specStats(spec: $spec) {
      spec
      count
      avgWallClockDuration
    }
  }
`;

/**
 * __useGetSpecStatsQuery__
 *
 * To run a query within a React component, call `useGetSpecStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSpecStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSpecStatsQuery({
 *   variables: {
 *      spec: // value for 'spec'
 *   },
 * });
 */
export function useGetSpecStatsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetSpecStatsQuery,
    GetSpecStatsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSpecStatsQuery, GetSpecStatsQueryVariables>(
    GetSpecStatsDocument,
    options
  );
}
export function useGetSpecStatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSpecStatsQuery,
    GetSpecStatsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSpecStatsQuery, GetSpecStatsQueryVariables>(
    GetSpecStatsDocument,
    options
  );
}
export type GetSpecStatsQueryHookResult = ReturnType<
  typeof useGetSpecStatsQuery
>;
export type GetSpecStatsLazyQueryHookResult = ReturnType<
  typeof useGetSpecStatsLazyQuery
>;
export type GetSpecStatsQueryResult = Apollo.QueryResult<
  GetSpecStatsQuery,
  GetSpecStatsQueryVariables
>;
export const GetRunDocument = gql`
  query getRun($runId: ID!) {
    run(id: $runId) {
      runId
      createdAt
      completion {
        ...RunSummaryCompletion
      }
      meta {
        ...RunSummaryMeta
      }
      specs {
        ...RunDetailSpec
      }
      progress {
        ...RunProgress
      }
    }
  }
  ${RunSummaryCompletionFragmentDoc}
  ${RunSummaryMetaFragmentDoc}
  ${RunDetailSpecFragmentDoc}
  ${RunProgressFragmentDoc}
`;

/**
 * __useGetRunQuery__
 *
 * To run a query within a React component, call `useGetRunQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRunQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRunQuery({
 *   variables: {
 *      runId: // value for 'runId'
 *   },
 * });
 */
export function useGetRunQuery(
  baseOptions: Apollo.QueryHookOptions<GetRunQuery, GetRunQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRunQuery, GetRunQueryVariables>(
    GetRunDocument,
    options
  );
}
export function useGetRunLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetRunQuery, GetRunQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetRunQuery, GetRunQueryVariables>(
    GetRunDocument,
    options
  );
}
export type GetRunQueryHookResult = ReturnType<typeof useGetRunQuery>;
export type GetRunLazyQueryHookResult = ReturnType<typeof useGetRunLazyQuery>;
export type GetRunQueryResult = Apollo.QueryResult<
  GetRunQuery,
  GetRunQueryVariables
>;
export const ResetInstanceDocument = gql`
  mutation resetInstance($instanceId: ID!) {
    resetInstance(instanceId: $instanceId) {
      success
      message
      instanceId
    }
  }
`;
export type ResetInstanceMutationFn = Apollo.MutationFunction<
  ResetInstanceMutation,
  ResetInstanceMutationVariables
>;

/**
 * __useResetInstanceMutation__
 *
 * To run a mutation, you first call `useResetInstanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetInstanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetInstanceMutation, { data, loading, error }] = useResetInstanceMutation({
 *   variables: {
 *      instanceId: // value for 'instanceId'
 *   },
 * });
 */
export function useResetInstanceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ResetInstanceMutation,
    ResetInstanceMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ResetInstanceMutation,
    ResetInstanceMutationVariables
  >(ResetInstanceDocument, options);
}
export type ResetInstanceMutationHookResult = ReturnType<
  typeof useResetInstanceMutation
>;
export type ResetInstanceMutationResult = Apollo.MutationResult<
  ResetInstanceMutation
>;
export type ResetInstanceMutationOptions = Apollo.BaseMutationOptions<
  ResetInstanceMutation,
  ResetInstanceMutationVariables
>;
export const GetRunsFeedDocument = gql`
  query getRunsFeed($cursor: String, $filters: [Filters!]!) {
    runFeed(cursor: $cursor, filters: $filters) {
      cursor
      hasMore
      runs {
        runId
        createdAt
        completion {
          ...RunSummaryCompletion
        }
        meta {
          ...RunSummaryMeta
        }
        progress {
          ...RunProgress
        }
      }
    }
  }
  ${RunSummaryCompletionFragmentDoc}
  ${RunSummaryMetaFragmentDoc}
  ${RunProgressFragmentDoc}
`;

/**
 * __useGetRunsFeedQuery__
 *
 * To run a query within a React component, call `useGetRunsFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRunsFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRunsFeedQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetRunsFeedQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetRunsFeedQuery,
    GetRunsFeedQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRunsFeedQuery, GetRunsFeedQueryVariables>(
    GetRunsFeedDocument,
    options
  );
}
export function useGetRunsFeedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRunsFeedQuery,
    GetRunsFeedQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetRunsFeedQuery, GetRunsFeedQueryVariables>(
    GetRunsFeedDocument,
    options
  );
}
export type GetRunsFeedQueryHookResult = ReturnType<typeof useGetRunsFeedQuery>;
export type GetRunsFeedLazyQueryHookResult = ReturnType<
  typeof useGetRunsFeedLazyQuery
>;
export type GetRunsFeedQueryResult = Apollo.QueryResult<
  GetRunsFeedQuery,
  GetRunsFeedQueryVariables
>;

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {},
};
export default result;
