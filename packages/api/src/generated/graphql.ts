import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  GenericHookType: any;
  SlackHookType: any;
  SlackResultFilter: any;
  GithubHookType: any;
  BitbucketHookType: any;
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  projects: Array<Project>;
  project?: Maybe<Project>;
  runs: Array<Maybe<Run>>;
  runFeed: RunFeed;
  run?: Maybe<Run>;
  instance?: Maybe<Instance>;
  specStats?: Maybe<SpecStats>;
};

export type QueryProjectsArgs = {
  orderDirection?: Maybe<OrderingOptions>;
  filters?: Maybe<Array<Maybe<Filters>>>;
};

export type QueryProjectArgs = {
  id: Scalars['ID'];
};

export type QueryRunsArgs = {
  orderDirection?: Maybe<OrderingOptions>;
  cursor?: Maybe<Scalars['String']>;
  filters?: Maybe<Array<Maybe<Filters>>>;
};

export type QueryRunFeedArgs = {
  cursor?: Maybe<Scalars['String']>;
  filters?: Maybe<Array<Maybe<Filters>>>;
};

export type QueryRunArgs = {
  id: Scalars['ID'];
};

export type QueryInstanceArgs = {
  id: Scalars['ID'];
};

export type QuerySpecStatsArgs = {
  spec: Scalars['String'];
  filters?: Maybe<Array<Maybe<Filters>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteRun: DeleteRunResponse;
  deleteRuns: DeleteRunResponse;
  deleteRunsInDateRange: DeleteRunResponse;
  resetInstance: ResetInstanceResponse;
  deleteProject: DeleteProjectResponse;
  createProject: Project;
  updateProject: Project;
  createGenericHook: GenericHook;
  updateGenericHook: GenericHook;
  createBitbucketHook: BitbucketHook;
  updateBitbucketHook: BitbucketHook;
  createGithubHook: GithubHook;
  updateGithubHook: GithubHook;
  createSlackHook: SlackHook;
  updateSlackHook: SlackHook;
  deleteHook: DeleteHookResponse;
};

export type MutationDeleteRunArgs = {
  runId: Scalars['ID'];
};

export type MutationDeleteRunsArgs = {
  runIds: Array<Maybe<Scalars['ID']>>;
};

export type MutationDeleteRunsInDateRangeArgs = {
  startDate: Scalars['DateTime'];
  endDate: Scalars['DateTime'];
};

export type MutationResetInstanceArgs = {
  instanceId: Scalars['ID'];
};

export type MutationDeleteProjectArgs = {
  projectId: Scalars['ID'];
};

export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
};

export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};

export type MutationCreateGenericHookArgs = {
  input: CreateGenericHookInput;
};

export type MutationUpdateGenericHookArgs = {
  input: UpdateGenericHookInput;
};

export type MutationCreateBitbucketHookArgs = {
  input: CreateBitbucketHookInput;
};

export type MutationUpdateBitbucketHookArgs = {
  input: UpdateBitbucketHookInput;
};

export type MutationCreateGithubHookArgs = {
  input: CreateGithubHookInput;
};

export type MutationUpdateGithubHookArgs = {
  input: UpdateGithubHookInput;
};

export type MutationCreateSlackHookArgs = {
  input: CreateSlackHookInput;
};

export type MutationUpdateSlackHookArgs = {
  input: UpdateSlackHookInput;
};

export type MutationDeleteHookArgs = {
  input: DeleteHookInput;
};

export type DeleteRunResponse = {
  __typename?: 'DeleteRunResponse';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  runIds: Array<Maybe<Scalars['ID']>>;
};

export type SpecStats = {
  __typename?: 'SpecStats';
  spec: Scalars['String'];
  avgWallClockDuration: Scalars['Int'];
  count: Scalars['Int'];
};

export type DeleteHookInput = {
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
};

export type DeleteHookResponse = {
  __typename?: 'DeleteHookResponse';
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
};

export type SlackHook = {
  __typename?: 'SlackHook';
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  hookType: Scalars['SlackHookType'];
  hookEvents: Array<Scalars['String']>;
  slackResultFilter: Scalars['SlackResultFilter'];
  slackBranchFilter?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type CreateSlackHookInput = {
  projectId: Scalars['ID'];
  slackResultFilter?: Maybe<Scalars['SlackResultFilter']>;
};

export type UpdateSlackHookInput = {
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  hookEvents: Array<Scalars['String']>;
  slackResultFilter: Scalars['SlackResultFilter'];
  slackBranchFilter?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type GithubHook = {
  __typename?: 'GithubHook';
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  hookType: Scalars['GithubHookType'];
  githubToken?: Maybe<Scalars['String']>;
  githubContext?: Maybe<Scalars['String']>;
};

export type CreateGithubHookInput = {
  projectId: Scalars['ID'];
};

export type UpdateGithubHookInput = {
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  githubToken?: Maybe<Scalars['String']>;
  githubContext?: Maybe<Scalars['String']>;
};

export type BitbucketHook = {
  __typename?: 'BitbucketHook';
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  hookType: Scalars['BitbucketHookType'];
  bitbucketUsername?: Maybe<Scalars['String']>;
  bitbucketToken?: Maybe<Scalars['String']>;
  bitbucketBuildName?: Maybe<Scalars['String']>;
};

export type CreateBitbucketHookInput = {
  projectId: Scalars['ID'];
};

export type UpdateBitbucketHookInput = {
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url?: Maybe<Scalars['String']>;
  bitbucketUsername: Scalars['String'];
  bitbucketToken?: Maybe<Scalars['String']>;
  bitbucketBuildName?: Maybe<Scalars['String']>;
};

export type GenericHook = {
  __typename?: 'GenericHook';
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  headers?: Maybe<Scalars['String']>;
  hookType: Scalars['GenericHookType'];
  hookEvents: Array<Scalars['String']>;
};

export type CreateGenericHookInput = {
  projectId: Scalars['ID'];
};

export type UpdateGenericHookInput = {
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  headers?: Maybe<Scalars['String']>;
  hookEvents: Array<Scalars['String']>;
};

export type Hook = {
  __typename?: 'Hook';
  hookId?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  headers?: Maybe<Scalars['String']>;
  hookEvents?: Maybe<Array<Maybe<Scalars['String']>>>;
  hookType?: Maybe<Scalars['String']>;
  githubToken?: Maybe<Scalars['String']>;
  githubContext?: Maybe<Scalars['String']>;
  bitbucketUsername?: Maybe<Scalars['String']>;
  bitbucketToken?: Maybe<Scalars['String']>;
  bitbucketBuildName?: Maybe<Scalars['String']>;
  slackResultFilter?: Maybe<Scalars['String']>;
  slackBranchFilter?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Project = {
  __typename?: 'Project';
  projectId: Scalars['ID'];
  hooks: Array<Hook>;
  inactivityTimeoutSeconds?: Maybe<Scalars['Int']>;
};

export type HookInput = {
  hookId?: Maybe<Scalars['String']>;
  url: Scalars['String'];
  headers?: Maybe<Scalars['String']>;
  hookEvents?: Maybe<Array<Maybe<Scalars['String']>>>;
  hookType?: Maybe<Scalars['String']>;
  githubToken?: Maybe<Scalars['String']>;
  githubContext?: Maybe<Scalars['String']>;
  bitbucketUsername?: Maybe<Scalars['String']>;
  bitbucketToken?: Maybe<Scalars['String']>;
  bitbucketBuildName?: Maybe<Scalars['String']>;
  slackResultFilter?: Maybe<Scalars['String']>;
  slackBranchFilter?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type CreateProjectInput = {
  projectId: Scalars['ID'];
  inactivityTimeoutSeconds: Scalars['Int'];
};

export type UpdateProjectInput = {
  projectId: Scalars['ID'];
  inactivityTimeoutSeconds: Scalars['Int'];
};

export type ProjectInput = {
  projectId: Scalars['String'];
  inactivityTimeoutSeconds?: Maybe<Scalars['Int']>;
  hooks?: Maybe<Array<Maybe<HookInput>>>;
};

export type DeleteProjectResponse = {
  __typename?: 'DeleteProjectResponse';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  projectIds: Array<Maybe<Scalars['ID']>>;
};

export type Run = {
  __typename?: 'Run';
  runId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  meta: RunMeta;
  specs: Array<RunSpec>;
  completion?: Maybe<RunCompletion>;
};

export type RunCompletion = {
  __typename?: 'RunCompletion';
  completed: Scalars['Boolean'];
  inactivityTimeoutMs?: Maybe<Scalars['Int']>;
};

export type RunSpec = {
  __typename?: 'RunSpec';
  spec: Scalars['String'];
  instanceId: Scalars['String'];
  claimedAt?: Maybe<Scalars['String']>;
  completedAt?: Maybe<Scalars['String']>;
  machineId?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  results?: Maybe<InstanceResults>;
};

export type Commit = {
  __typename?: 'Commit';
  sha?: Maybe<Scalars['String']>;
  branch?: Maybe<Scalars['String']>;
  authorName?: Maybe<Scalars['String']>;
  authorEmail?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  remoteOrigin?: Maybe<Scalars['String']>;
};

export type RunMeta = {
  __typename?: 'RunMeta';
  ciBuildId: Scalars['String'];
  projectId: Scalars['String'];
  commit?: Maybe<Commit>;
};

export type ResetInstanceResponse = {
  __typename?: 'ResetInstanceResponse';
  instanceId: Scalars['ID'];
  message: Scalars['String'];
  success?: Maybe<Scalars['Boolean']>;
};

export type RunFeed = {
  __typename?: 'RunFeed';
  cursor: Scalars['String'];
  hasMore: Scalars['Boolean'];
  runs: Array<Run>;
};

export type Instance = {
  __typename?: 'Instance';
  runId: Scalars['ID'];
  run: Run;
  spec: Scalars['String'];
  groupId: Scalars['String'];
  instanceId: Scalars['ID'];
  results?: Maybe<InstanceResults>;
};

export type InstanceResults = {
  __typename?: 'InstanceResults';
  stats: InstanceStats;
  tests?: Maybe<Array<InstanceTestUnion>>;
  error?: Maybe<Scalars['String']>;
  stdout?: Maybe<Scalars['String']>;
  screenshots: Array<InstanceScreeshot>;
  cypressConfig?: Maybe<CypressConfig>;
  reporterStats?: Maybe<ReporterStats>;
  videoUrl?: Maybe<Scalars['String']>;
};

export type InstanceStats = {
  __typename?: 'InstanceStats';
  suites: Scalars['Int'];
  tests: Scalars['Int'];
  passes: Scalars['Int'];
  pending: Scalars['Int'];
  skipped: Scalars['Int'];
  failures: Scalars['Int'];
  wallClockStartedAt: Scalars['String'];
  wallClockEndedAt: Scalars['String'];
  wallClockDuration: Scalars['Int'];
};

export type CypressConfig = {
  __typename?: 'CypressConfig';
  video: Scalars['Boolean'];
  videoUploadOnPasses: Scalars['Boolean'];
};

export type InstanceScreeshot = {
  __typename?: 'InstanceScreeshot';
  screenshotId: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  testId: Scalars['String'];
  takenAt: Scalars['String'];
  height: Scalars['Int'];
  width: Scalars['Int'];
  screenshotURL?: Maybe<Scalars['String']>;
};

export type ReporterStats = {
  __typename?: 'ReporterStats';
  suites?: Maybe<Scalars['Int']>;
  tests?: Maybe<Scalars['Int']>;
  passes?: Maybe<Scalars['Int']>;
  pending?: Maybe<Scalars['Int']>;
  failures?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['String']>;
  end?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
};

export type InstanceTestUnion = InstanceTest | InstanceTestV5;

export enum TestState {
  Failed = 'failed',
  Passed = 'passed',
  Pending = 'pending',
  Skipped = 'skipped',
}

export type InstanceTest = {
  __typename?: 'InstanceTest';
  testId: Scalars['String'];
  title: Array<Scalars['String']>;
  state: TestState;
  body?: Maybe<Scalars['String']>;
  stack?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  wallClockStartedAt?: Maybe<Scalars['String']>;
  wallClockDuration?: Maybe<Scalars['Int']>;
};

export type InstanceTestV5 = {
  __typename?: 'InstanceTestV5';
  testId: Scalars['String'];
  title: Array<Scalars['String']>;
  state: TestState;
  body?: Maybe<Scalars['String']>;
  displayError?: Maybe<Scalars['String']>;
  attempts: Array<TestAttempt>;
};

export type TestError = {
  __typename?: 'TestError';
  name: Scalars['String'];
  message: Scalars['String'];
  stack: Scalars['String'];
};

export type TestAttempt = {
  __typename?: 'TestAttempt';
  state?: Maybe<Scalars['String']>;
  error?: Maybe<TestError>;
  wallClockStartedAt?: Maybe<Scalars['String']>;
  wallClockDuration?: Maybe<Scalars['Int']>;
};

export enum OrderingOptions {
  Desc = 'DESC',
  Asc = 'ASC',
}

export type Filters = {
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  like?: Maybe<Scalars['String']>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (
  obj: T,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Mutation: ResolverTypeWrapper<{}>;
  DeleteRunResponse: ResolverTypeWrapper<DeleteRunResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  SpecStats: ResolverTypeWrapper<SpecStats>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  GenericHookType: ResolverTypeWrapper<Scalars['GenericHookType']>;
  SlackHookType: ResolverTypeWrapper<Scalars['SlackHookType']>;
  SlackResultFilter: ResolverTypeWrapper<Scalars['SlackResultFilter']>;
  GithubHookType: ResolverTypeWrapper<Scalars['GithubHookType']>;
  BitbucketHookType: ResolverTypeWrapper<Scalars['BitbucketHookType']>;
  DeleteHookInput: DeleteHookInput;
  DeleteHookResponse: ResolverTypeWrapper<DeleteHookResponse>;
  SlackHook: ResolverTypeWrapper<SlackHook>;
  CreateSlackHookInput: CreateSlackHookInput;
  UpdateSlackHookInput: UpdateSlackHookInput;
  GithubHook: ResolverTypeWrapper<GithubHook>;
  CreateGithubHookInput: CreateGithubHookInput;
  UpdateGithubHookInput: UpdateGithubHookInput;
  BitbucketHook: ResolverTypeWrapper<BitbucketHook>;
  CreateBitbucketHookInput: CreateBitbucketHookInput;
  UpdateBitbucketHookInput: UpdateBitbucketHookInput;
  GenericHook: ResolverTypeWrapper<GenericHook>;
  CreateGenericHookInput: CreateGenericHookInput;
  UpdateGenericHookInput: UpdateGenericHookInput;
  Hook: ResolverTypeWrapper<Hook>;
  Project: ResolverTypeWrapper<Project>;
  HookInput: HookInput;
  CreateProjectInput: CreateProjectInput;
  UpdateProjectInput: UpdateProjectInput;
  ProjectInput: ProjectInput;
  DeleteProjectResponse: ResolverTypeWrapper<DeleteProjectResponse>;
  Run: ResolverTypeWrapper<Run>;
  RunCompletion: ResolverTypeWrapper<RunCompletion>;
  RunSpec: ResolverTypeWrapper<RunSpec>;
  Commit: ResolverTypeWrapper<Commit>;
  RunMeta: ResolverTypeWrapper<RunMeta>;
  ResetInstanceResponse: ResolverTypeWrapper<ResetInstanceResponse>;
  RunFeed: ResolverTypeWrapper<RunFeed>;
  Instance: ResolverTypeWrapper<Instance>;
  InstanceResults: ResolverTypeWrapper<
    Omit<InstanceResults, 'tests'> & {
      tests?: Maybe<Array<ResolversTypes['InstanceTestUnion']>>;
    }
  >;
  InstanceStats: ResolverTypeWrapper<InstanceStats>;
  CypressConfig: ResolverTypeWrapper<CypressConfig>;
  InstanceScreeshot: ResolverTypeWrapper<InstanceScreeshot>;
  ReporterStats: ResolverTypeWrapper<ReporterStats>;
  InstanceTestUnion:
    | ResolversTypes['InstanceTest']
    | ResolversTypes['InstanceTestV5'];
  TestState: TestState;
  InstanceTest: ResolverTypeWrapper<InstanceTest>;
  InstanceTestV5: ResolverTypeWrapper<InstanceTestV5>;
  TestError: ResolverTypeWrapper<TestError>;
  TestAttempt: ResolverTypeWrapper<TestAttempt>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  OrderingOptions: OrderingOptions;
  Filters: Filters;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  ID: Scalars['ID'];
  String: Scalars['String'];
  Mutation: {};
  DeleteRunResponse: DeleteRunResponse;
  Boolean: Scalars['Boolean'];
  SpecStats: SpecStats;
  Int: Scalars['Int'];
  GenericHookType: Scalars['GenericHookType'];
  SlackHookType: Scalars['SlackHookType'];
  SlackResultFilter: Scalars['SlackResultFilter'];
  GithubHookType: Scalars['GithubHookType'];
  BitbucketHookType: Scalars['BitbucketHookType'];
  DeleteHookInput: DeleteHookInput;
  DeleteHookResponse: DeleteHookResponse;
  SlackHook: SlackHook;
  CreateSlackHookInput: CreateSlackHookInput;
  UpdateSlackHookInput: UpdateSlackHookInput;
  GithubHook: GithubHook;
  CreateGithubHookInput: CreateGithubHookInput;
  UpdateGithubHookInput: UpdateGithubHookInput;
  BitbucketHook: BitbucketHook;
  CreateBitbucketHookInput: CreateBitbucketHookInput;
  UpdateBitbucketHookInput: UpdateBitbucketHookInput;
  GenericHook: GenericHook;
  CreateGenericHookInput: CreateGenericHookInput;
  UpdateGenericHookInput: UpdateGenericHookInput;
  Hook: Hook;
  Project: Project;
  HookInput: HookInput;
  CreateProjectInput: CreateProjectInput;
  UpdateProjectInput: UpdateProjectInput;
  ProjectInput: ProjectInput;
  DeleteProjectResponse: DeleteProjectResponse;
  Run: Run;
  RunCompletion: RunCompletion;
  RunSpec: RunSpec;
  Commit: Commit;
  RunMeta: RunMeta;
  ResetInstanceResponse: ResetInstanceResponse;
  RunFeed: RunFeed;
  Instance: Instance;
  InstanceResults: Omit<InstanceResults, 'tests'> & {
    tests?: Maybe<Array<ResolversParentTypes['InstanceTestUnion']>>;
  };
  InstanceStats: InstanceStats;
  CypressConfig: CypressConfig;
  InstanceScreeshot: InstanceScreeshot;
  ReporterStats: ReporterStats;
  InstanceTestUnion:
    | ResolversParentTypes['InstanceTest']
    | ResolversParentTypes['InstanceTestV5'];
  InstanceTest: InstanceTest;
  InstanceTestV5: InstanceTestV5;
  TestError: TestError;
  TestAttempt: TestAttempt;
  DateTime: Scalars['DateTime'];
  Filters: Filters;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  projects?: Resolver<
    Array<ResolversTypes['Project']>,
    ParentType,
    ContextType,
    RequireFields<QueryProjectsArgs, 'orderDirection' | 'filters'>
  >;
  project?: Resolver<
    Maybe<ResolversTypes['Project']>,
    ParentType,
    ContextType,
    RequireFields<QueryProjectArgs, 'id'>
  >;
  runs?: Resolver<
    Array<Maybe<ResolversTypes['Run']>>,
    ParentType,
    ContextType,
    RequireFields<QueryRunsArgs, 'orderDirection' | 'cursor' | 'filters'>
  >;
  runFeed?: Resolver<
    ResolversTypes['RunFeed'],
    ParentType,
    ContextType,
    RequireFields<QueryRunFeedArgs, 'filters'>
  >;
  run?: Resolver<
    Maybe<ResolversTypes['Run']>,
    ParentType,
    ContextType,
    RequireFields<QueryRunArgs, 'id'>
  >;
  instance?: Resolver<
    Maybe<ResolversTypes['Instance']>,
    ParentType,
    ContextType,
    RequireFields<QueryInstanceArgs, 'id'>
  >;
  specStats?: Resolver<
    Maybe<ResolversTypes['SpecStats']>,
    ParentType,
    ContextType,
    RequireFields<QuerySpecStatsArgs, 'spec' | 'filters'>
  >;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  deleteRun?: Resolver<
    ResolversTypes['DeleteRunResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteRunArgs, 'runId'>
  >;
  deleteRuns?: Resolver<
    ResolversTypes['DeleteRunResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteRunsArgs, 'runIds'>
  >;
  deleteRunsInDateRange?: Resolver<
    ResolversTypes['DeleteRunResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteRunsInDateRangeArgs, 'startDate' | 'endDate'>
  >;
  resetInstance?: Resolver<
    ResolversTypes['ResetInstanceResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationResetInstanceArgs, 'instanceId'>
  >;
  deleteProject?: Resolver<
    ResolversTypes['DeleteProjectResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteProjectArgs, 'projectId'>
  >;
  createProject?: Resolver<
    ResolversTypes['Project'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateProjectArgs, 'project'>
  >;
  updateProject?: Resolver<
    ResolversTypes['Project'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateProjectArgs, 'input'>
  >;
  createGenericHook?: Resolver<
    ResolversTypes['GenericHook'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateGenericHookArgs, 'input'>
  >;
  updateGenericHook?: Resolver<
    ResolversTypes['GenericHook'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateGenericHookArgs, 'input'>
  >;
  createBitbucketHook?: Resolver<
    ResolversTypes['BitbucketHook'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateBitbucketHookArgs, 'input'>
  >;
  updateBitbucketHook?: Resolver<
    ResolversTypes['BitbucketHook'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateBitbucketHookArgs, 'input'>
  >;
  createGithubHook?: Resolver<
    ResolversTypes['GithubHook'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateGithubHookArgs, 'input'>
  >;
  updateGithubHook?: Resolver<
    ResolversTypes['GithubHook'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateGithubHookArgs, 'input'>
  >;
  createSlackHook?: Resolver<
    ResolversTypes['SlackHook'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateSlackHookArgs, 'input'>
  >;
  updateSlackHook?: Resolver<
    ResolversTypes['SlackHook'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateSlackHookArgs, 'input'>
  >;
  deleteHook?: Resolver<
    ResolversTypes['DeleteHookResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteHookArgs, 'input'>
  >;
};

export type DeleteRunResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DeleteRunResponse'] = ResolversParentTypes['DeleteRunResponse']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  runIds?: Resolver<
    Array<Maybe<ResolversTypes['ID']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SpecStatsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SpecStats'] = ResolversParentTypes['SpecStats']
> = {
  spec?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  avgWallClockDuration?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType
  >;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export interface GenericHookTypeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['GenericHookType'], any> {
  name: 'GenericHookType';
}

export interface SlackHookTypeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['SlackHookType'], any> {
  name: 'SlackHookType';
}

export interface SlackResultFilterScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['SlackResultFilter'], any> {
  name: 'SlackResultFilter';
}

export interface GithubHookTypeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['GithubHookType'], any> {
  name: 'GithubHookType';
}

export interface BitbucketHookTypeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['BitbucketHookType'], any> {
  name: 'BitbucketHookType';
}

export type DeleteHookResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DeleteHookResponse'] = ResolversParentTypes['DeleteHookResponse']
> = {
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hookId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SlackHookResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SlackHook'] = ResolversParentTypes['SlackHook']
> = {
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hookId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hookType?: Resolver<ResolversTypes['SlackHookType'], ParentType, ContextType>;
  hookEvents?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  slackResultFilter?: Resolver<
    ResolversTypes['SlackResultFilter'],
    ParentType,
    ContextType
  >;
  slackBranchFilter?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GithubHookResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GithubHook'] = ResolversParentTypes['GithubHook']
> = {
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hookId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hookType?: Resolver<
    ResolversTypes['GithubHookType'],
    ParentType,
    ContextType
  >;
  githubToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  githubContext?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type BitbucketHookResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BitbucketHook'] = ResolversParentTypes['BitbucketHook']
> = {
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hookId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hookType?: Resolver<
    ResolversTypes['BitbucketHookType'],
    ParentType,
    ContextType
  >;
  bitbucketUsername?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  bitbucketToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  bitbucketBuildName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GenericHookResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GenericHook'] = ResolversParentTypes['GenericHook']
> = {
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hookId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  headers?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hookType?: Resolver<
    ResolversTypes['GenericHookType'],
    ParentType,
    ContextType
  >;
  hookEvents?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type HookResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Hook'] = ResolversParentTypes['Hook']
> = {
  hookId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  headers?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hookEvents?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  hookType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  githubToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  githubContext?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  bitbucketUsername?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  bitbucketToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  bitbucketBuildName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  slackResultFilter?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  slackBranchFilter?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type ProjectResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']
> = {
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hooks?: Resolver<Array<ResolversTypes['Hook']>, ParentType, ContextType>;
  inactivityTimeoutSeconds?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type DeleteProjectResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DeleteProjectResponse'] = ResolversParentTypes['DeleteProjectResponse']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projectIds?: Resolver<
    Array<Maybe<ResolversTypes['ID']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type RunResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Run'] = ResolversParentTypes['Run']
> = {
  runId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['RunMeta'], ParentType, ContextType>;
  specs?: Resolver<Array<ResolversTypes['RunSpec']>, ParentType, ContextType>;
  completion?: Resolver<
    Maybe<ResolversTypes['RunCompletion']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type RunCompletionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunCompletion'] = ResolversParentTypes['RunCompletion']
> = {
  completed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  inactivityTimeoutMs?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type RunSpecResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunSpec'] = ResolversParentTypes['RunSpec']
> = {
  spec?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  instanceId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  claimedAt?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  completedAt?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  machineId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  groupId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  results?: Resolver<
    Maybe<ResolversTypes['InstanceResults']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CommitResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Commit'] = ResolversParentTypes['Commit']
> = {
  sha?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  branch?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  authorName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  authorEmail?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  remoteOrigin?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type RunMetaResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunMeta'] = ResolversParentTypes['RunMeta']
> = {
  ciBuildId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  commit?: Resolver<Maybe<ResolversTypes['Commit']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type ResetInstanceResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ResetInstanceResponse'] = ResolversParentTypes['ResetInstanceResponse']
> = {
  instanceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type RunFeedResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunFeed'] = ResolversParentTypes['RunFeed']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasMore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  runs?: Resolver<Array<ResolversTypes['Run']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type InstanceResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Instance'] = ResolversParentTypes['Instance']
> = {
  runId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  run?: Resolver<ResolversTypes['Run'], ParentType, ContextType>;
  spec?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  groupId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  instanceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  results?: Resolver<
    Maybe<ResolversTypes['InstanceResults']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type InstanceResultsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InstanceResults'] = ResolversParentTypes['InstanceResults']
> = {
  stats?: Resolver<ResolversTypes['InstanceStats'], ParentType, ContextType>;
  tests?: Resolver<
    Maybe<Array<ResolversTypes['InstanceTestUnion']>>,
    ParentType,
    ContextType
  >;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stdout?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  screenshots?: Resolver<
    Array<ResolversTypes['InstanceScreeshot']>,
    ParentType,
    ContextType
  >;
  cypressConfig?: Resolver<
    Maybe<ResolversTypes['CypressConfig']>,
    ParentType,
    ContextType
  >;
  reporterStats?: Resolver<
    Maybe<ResolversTypes['ReporterStats']>,
    ParentType,
    ContextType
  >;
  videoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type InstanceStatsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InstanceStats'] = ResolversParentTypes['InstanceStats']
> = {
  suites?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tests?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  passes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pending?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  skipped?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  failures?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  wallClockStartedAt?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  wallClockEndedAt?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  wallClockDuration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CypressConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CypressConfig'] = ResolversParentTypes['CypressConfig']
> = {
  video?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  videoUploadOnPasses?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type InstanceScreeshotResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InstanceScreeshot'] = ResolversParentTypes['InstanceScreeshot']
> = {
  screenshotId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  testId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  takenAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  screenshotURL?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type ReporterStatsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ReporterStats'] = ResolversParentTypes['ReporterStats']
> = {
  suites?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tests?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  passes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pending?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  failures?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  end?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type InstanceTestUnionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InstanceTestUnion'] = ResolversParentTypes['InstanceTestUnion']
> = {
  __resolveType: TypeResolveFn<
    'InstanceTest' | 'InstanceTestV5',
    ParentType,
    ContextType
  >;
};

export type InstanceTestResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InstanceTest'] = ResolversParentTypes['InstanceTest']
> = {
  testId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<ResolversTypes['TestState'], ParentType, ContextType>;
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stack?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  wallClockStartedAt?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  wallClockDuration?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type InstanceTestV5Resolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InstanceTestV5'] = ResolversParentTypes['InstanceTestV5']
> = {
  testId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<ResolversTypes['TestState'], ParentType, ContextType>;
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displayError?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  attempts?: Resolver<
    Array<ResolversTypes['TestAttempt']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type TestErrorResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TestError'] = ResolversParentTypes['TestError']
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stack?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type TestAttemptResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TestAttempt'] = ResolversParentTypes['TestAttempt']
> = {
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['TestError']>, ParentType, ContextType>;
  wallClockStartedAt?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  wallClockDuration?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type Resolvers<ContextType = any> = {
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  DeleteRunResponse?: DeleteRunResponseResolvers<ContextType>;
  SpecStats?: SpecStatsResolvers<ContextType>;
  GenericHookType?: GraphQLScalarType;
  SlackHookType?: GraphQLScalarType;
  SlackResultFilter?: GraphQLScalarType;
  GithubHookType?: GraphQLScalarType;
  BitbucketHookType?: GraphQLScalarType;
  DeleteHookResponse?: DeleteHookResponseResolvers<ContextType>;
  SlackHook?: SlackHookResolvers<ContextType>;
  GithubHook?: GithubHookResolvers<ContextType>;
  BitbucketHook?: BitbucketHookResolvers<ContextType>;
  GenericHook?: GenericHookResolvers<ContextType>;
  Hook?: HookResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  DeleteProjectResponse?: DeleteProjectResponseResolvers<ContextType>;
  Run?: RunResolvers<ContextType>;
  RunCompletion?: RunCompletionResolvers<ContextType>;
  RunSpec?: RunSpecResolvers<ContextType>;
  Commit?: CommitResolvers<ContextType>;
  RunMeta?: RunMetaResolvers<ContextType>;
  ResetInstanceResponse?: ResetInstanceResponseResolvers<ContextType>;
  RunFeed?: RunFeedResolvers<ContextType>;
  Instance?: InstanceResolvers<ContextType>;
  InstanceResults?: InstanceResultsResolvers<ContextType>;
  InstanceStats?: InstanceStatsResolvers<ContextType>;
  CypressConfig?: CypressConfigResolvers<ContextType>;
  InstanceScreeshot?: InstanceScreeshotResolvers<ContextType>;
  ReporterStats?: ReporterStatsResolvers<ContextType>;
  InstanceTestUnion?: InstanceTestUnionResolvers<ContextType>;
  InstanceTest?: InstanceTestResolvers<ContextType>;
  InstanceTestV5?: InstanceTestV5Resolvers<ContextType>;
  TestError?: TestErrorResolvers<ContextType>;
  TestAttempt?: TestAttemptResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
