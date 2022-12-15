module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: ['@guardian/eslint-config-typescript'],
  parserOptions: {
    ecmaVersion: 2020,
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    project: ['./tsconfig.eslint.json'],
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-inferrable-types': 0,
    'import/no-namespace': 2,
    '@typescript-eslint/unbound-method': 0,
  },
  ignorePatterns: ['**/*.js', 'node_modules'],
};
