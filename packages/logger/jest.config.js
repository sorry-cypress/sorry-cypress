module.exports = {
  verbose: true,
  testEnvironment: 'node',
  transform: {
    '\\.[jt]sx?$': '<rootDir>/jest.transformer.js',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/?(*.)(spec|test).(t)s?(x)',
    '<rootDir>/src/test/**/?(*.)(spec|test).(t)s',
  ],
  transformIgnorePatterns: ['node_modules'],
  moduleNameMapper: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '@currents/([a-zA-Z0-9$_-]+)/(.*)$': '<rootDir>/../$1/src/$2',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '@currents/([a-zA-Z0-9$_-]+)$': '<rootDir>/../$1/src/index',
  },
  moduleFileExtensions: ['ts', 'js', 'd.ts'],
};
