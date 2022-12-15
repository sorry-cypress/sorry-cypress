# Infrastructure

This directory defines the components to be deployed to AWS

## Useful commands

We follow the [`script/task`](https://github.com/github/scripts-to-rule-them-all) pattern,
find useful scripts within the [`script`](./script) directory for common tasks.

- `./script/setup` to install dependencies
- `./script/start` to run the Jest unit tests in watch mode
- `./script/lint` to lint the code using ESLint
- `./script/test` to lint, run tests and generate templates of the CDK stacks
- `./script/diff` to print the diff between a CDK stack and a running CloudFormation stack
- `./script/ci` to run tests and synthesise the CDK template in CI

There are also some other commands defined in `package.json`, including:

- `yarn lint --fix` attempt to autofix any linter errors
- `yarn format` format the code using Prettier
- `yarn watch` watch for changes and compile

However, it's advised you configure your IDE to format on save to avoid horrible "correct linting" commits.
