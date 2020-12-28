#!/usr/bin/env node
const semver = require('semver');

const input = process.argv[2];

if (!semver.valid(semver.clean(input))) {
  console.log('Invalid input', input);
  process.exit(1);
}

if (semver.prerelease(input)) {
  console.log(withPrefix(semver.clean(input)));
  return;
}

const results = [
  withPrefix(semver.major(input)),
  withPrefix(`${semver.major(input)}.${semver.minor(input)}`),
  withPrefix(semver.clean(input)),
];
console.log(results.join(' '));

function withPrefix(i) {
  return `${i}`;
}
