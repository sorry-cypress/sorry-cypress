#!/usr/bin/env node
const semver = require('semver');

const input = process.argv[2];

if (semver.valid(semver.clean(input))) {
  console.log('true');
  return;
}
console.log('false');
return;
