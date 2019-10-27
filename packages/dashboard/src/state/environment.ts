export interface Environment {
  GRAPHQL_SCHEMA_URL: string;
}

// @ts-ignore
export const environment: Environment = (window.__sorryCypressEnvironment as Environment) || {
  GRAPHQL_SCHEMA_URL: 'http://localhost:4000'
};
