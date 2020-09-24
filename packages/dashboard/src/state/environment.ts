export interface Environment {
  GRAPHQL_SCHEMA_URL: string;
  BASE_URL: string;
}

export const environment: Environment = (window.__sorryCypressEnvironment as Environment) || {
  GRAPHQL_SCHEMA_URL: 'http://localhost:4000',
  BASE_URL: '',
};
