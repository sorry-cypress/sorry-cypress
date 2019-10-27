const tsNode = require('ts-node');
const tsPaths = require('tsconfig-paths');
const tsConfig = require('./tsconfig.json');

tsPaths.register({
  baseUrl: tsConfig.compilerOptions.baseUrl,
  paths: tsConfig.compilerOptions.paths
});

tsNode.register({
  project: './tsconfig.json'
});
