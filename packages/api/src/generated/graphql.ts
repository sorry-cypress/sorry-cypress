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
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  projects: Array<Maybe<Project>>;
  project?: Maybe<Project>;
  runs: Array<Maybe<Run>>;
  runFeed: RunFeed;
  run?: Maybe<Run>;
  instance?: Maybe<Instance>;
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

export type Mutation = {
  __typename?: 'Mutation';
  deleteRun: DeleteRunResponse;
  deleteRuns: DeleteRunResponse;
  deleteRunsInDateRange: DeleteRunResponse;
  deleteProject: DeleteProjectResponse;
  createProject: Project;
  updateProject: Project;
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

export type MutationDeleteProjectArgs = {
  projectId: Scalars['ID'];
};

export type MutationCreateProjectArgs = {
  project?: Maybe<ProjectInput>;
};

export type MutationUpdateProjectArgs = {
  project?: Maybe<ProjectInput>;
};

export type DeleteRunResponse = {
  __typename?: 'DeleteRunResponse';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  runIds: Array<Maybe<Scalars['ID']>>;
};

export type Hook = {
  __typename?: 'Hook';
  hookId?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  headers?: Maybe<Scalars['String']>;
  hookEvents?: Maybe<Array<Maybe<Scalars['String']>>>;
  hookType?: Maybe<Scalars['String']>;
  githubToken?: Maybe<Scalars['String']>;
};

export type Project = {
  __typename?: 'Project';
  projectId: Scalars['String'];
  hooks?: Maybe<Array<Maybe<Hook>>>;
};

export type HookInput = {
  hookId?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  headers?: Maybe<Scalars['String']>;
  hookEvents?: Maybe<Array<Maybe<Scalars['String']>>>;
  hookType?: Maybe<Scalars['String']>;
  githubToken?: Maybe<Scalars['String']>;
};

export type ProjectInput = {
  projectId: Scalars['String'];
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
  meta?: Maybe<RunMeta>;
  specs: Array<Maybe<FullRunSpec>>;
};

export type FullRunSpec = {
  __typename?: 'FullRunSpec';
  spec: Scalars['String'];
  instanceId: Scalars['String'];
  claimed: Scalars['Boolean'];
  claimedAt?: Maybe<Scalars['String']>;
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
  groupId?: Maybe<Scalars['String']>;
  ciBuildId?: Maybe<Scalars['String']>;
  projectId?: Maybe<Scalars['String']>;
  commit?: Maybe<Commit>;
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
  run: PartialRun;
  spec: Scalars['String'];
  instanceId: Scalars['ID'];
  results?: Maybe<InstanceResults>;
};

export type PartialRun = {
  __typename?: 'PartialRun';
  runId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  meta?: Maybe<RunMeta>;
  specs: Array<Maybe<RunSpec>>;
};

export type RunSpec = {
  __typename?: 'RunSpec';
  spec: Scalars['String'];
  instanceId: Scalars['String'];
  claimed: Scalars['Boolean'];
  claimedAt?: Maybe<Scalars['String']>;
};

export type InstanceResults = {
  __typename?: 'InstanceResults';
  stats: InstanceStats;
  tests?: Maybe<Array<Maybe<InstanceTestUnion>>>;
  error?: Maybe<Scalars['String']>;
  stdout?: Maybe<Scalars['String']>;
  screenshots: Array<InstanceScreeshot>;
  cypressConfig?: Maybe<CypressConfig>;
  reporterStats?: Maybe<ReporterStats>;
  videoUrl?: Maybe<Scalars['String']>;
};

export type InstanceStats = {
  __typename?: 'InstanceStats';
  suites?: Maybe<Scalars['Int']>;
  tests?: Maybe<Scalars['Int']>;
  passes?: Maybe<Scalars['Int']>;
  pending?: Maybe<Scalars['Int']>;
  skipped?: Maybe<Scalars['Int']>;
  failures?: Maybe<Scalars['Int']>;
  wallClockStartedAt?: Maybe<Scalars['String']>;
  wallClockEndedAt?: Maybe<Scalars['String']>;
  wallClockDuration?: Maybe<Scalars['Int']>;
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

export type InstanceTest = {
  __typename?: 'InstanceTest';
  testId: Scalars['String'];
  title?: Maybe<Array<Maybe<Scalars['String']>>>;
  state?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  stack?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  wallClockStartedAt?: Maybe<Scalars['String']>;
  wallClockDuration?: Maybe<Scalars['Int']>;
};

export type InstanceTestV5 = {
  __typename?: 'InstanceTestV5';
  testId: Scalars['String'];
  title?: Maybe<Array<Maybe<Scalars['String']>>>;
  state?: Maybe<Scalars['String']>;
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

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
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
  Hook: ResolverTypeWrapper<Hook>;
  Project: ResolverTypeWrapper<Project>;
  HookInput: HookInput;
  ProjectInput: ProjectInput;
  DeleteProjectResponse: ResolverTypeWrapper<DeleteProjectResponse>;
  Run: ResolverTypeWrapper<Run>;
  FullRunSpec: ResolverTypeWrapper<FullRunSpec>;
  Commit: ResolverTypeWrapper<Commit>;
  RunMeta: ResolverTypeWrapper<RunMeta>;
  RunFeed: ResolverTypeWrapper<RunFeed>;
  Instance: ResolverTypeWrapper<Instance>;
  PartialRun: ResolverTypeWrapper<PartialRun>;
  RunSpec: ResolverTypeWrapper<RunSpec>;
  InstanceResults: ResolverTypeWrapper<
    Omit<InstanceResults, 'tests'> & {
      tests?: Maybe<Array<Maybe<ResolversTypes['InstanceTestUnion']>>>;
    }
  >;
  InstanceStats: ResolverTypeWrapper<InstanceStats>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  CypressConfig: ResolverTypeWrapper<CypressConfig>;
  InstanceScreeshot: ResolverTypeWrapper<InstanceScreeshot>;
  ReporterStats: ResolverTypeWrapper<ReporterStats>;
  InstanceTestUnion:
    | ResolversTypes['InstanceTest']
    | ResolversTypes['InstanceTestV5'];
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
  Hook: Hook;
  Project: Project;
  HookInput: HookInput;
  ProjectInput: ProjectInput;
  DeleteProjectResponse: DeleteProjectResponse;
  Run: Run;
  FullRunSpec: FullRunSpec;
  Commit: Commit;
  RunMeta: RunMeta;
  RunFeed: RunFeed;
  Instance: Instance;
  PartialRun: PartialRun;
  RunSpec: RunSpec;
  InstanceResults: Omit<InstanceResults, 'tests'> & {
    tests?: Maybe<Array<Maybe<ResolversParentTypes['InstanceTestUnion']>>>;
  };
  InstanceStats: InstanceStats;
  Int: Scalars['Int'];
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
    Array<Maybe<ResolversTypes['Project']>>,
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
    RequireFields<MutationCreateProjectArgs, never>
  >;
  updateProject?: Resolver<
    ResolversTypes['Project'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateProjectArgs, never>
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']
> = {
  projectId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hooks?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Hook']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RunResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Run'] = ResolversParentTypes['Run']
> = {
  runId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  meta?: Resolver<Maybe<ResolversTypes['RunMeta']>, ParentType, ContextType>;
  specs?: Resolver<
    Array<Maybe<ResolversTypes['FullRunSpec']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FullRunSpecResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FullRunSpec'] = ResolversParentTypes['FullRunSpec']
> = {
  spec?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  instanceId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  claimed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  claimedAt?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  results?: Resolver<
    Maybe<ResolversTypes['InstanceResults']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RunMetaResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunMeta'] = ResolversParentTypes['RunMeta']
> = {
  groupId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ciBuildId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  projectId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  commit?: Resolver<Maybe<ResolversTypes['Commit']>, ParentType, ContextType>;
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
  run?: Resolver<ResolversTypes['PartialRun'], ParentType, ContextType>;
  spec?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  instanceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  results?: Resolver<
    Maybe<ResolversTypes['InstanceResults']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PartialRunResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PartialRun'] = ResolversParentTypes['PartialRun']
> = {
  runId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  meta?: Resolver<Maybe<ResolversTypes['RunMeta']>, ParentType, ContextType>;
  specs?: Resolver<
    Array<Maybe<ResolversTypes['RunSpec']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RunSpecResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunSpec'] = ResolversParentTypes['RunSpec']
> = {
  spec?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  instanceId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  claimed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  claimedAt?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InstanceResultsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InstanceResults'] = ResolversParentTypes['InstanceResults']
> = {
  stats?: Resolver<ResolversTypes['InstanceStats'], ParentType, ContextType>;
  tests?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['InstanceTestUnion']>>>,
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
  suites?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tests?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  passes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pending?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  skipped?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  failures?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  wallClockStartedAt?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  wallClockEndedAt?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  wallClockDuration?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
  title?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InstanceTestV5Resolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InstanceTestV5'] = ResolversParentTypes['InstanceTestV5']
> = {
  testId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type Resolvers<ContextType = any> = {
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  DeleteRunResponse?: DeleteRunResponseResolvers<ContextType>;
  Hook?: HookResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  DeleteProjectResponse?: DeleteProjectResponseResolvers<ContextType>;
  Run?: RunResolvers<ContextType>;
  FullRunSpec?: FullRunSpecResolvers<ContextType>;
  Commit?: CommitResolvers<ContextType>;
  RunMeta?: RunMetaResolvers<ContextType>;
  RunFeed?: RunFeedResolvers<ContextType>;
  Instance?: InstanceResolvers<ContextType>;
  PartialRun?: PartialRunResolvers<ContextType>;
  RunSpec?: RunSpecResolvers<ContextType>;
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
