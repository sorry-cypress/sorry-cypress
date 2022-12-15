module.exports = {
  testMatch: ['<rootDir>/lib/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
};
