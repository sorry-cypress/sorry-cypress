## Table of contents

- [Setup](#setup)
- [Demo & example](#demo--example)
- [Additional Resources](#additional-resources)
- [License](#license)

## Setup

1. `docker-compose build && docker-compose up`
2. Enjoy !

## Demo & Example

1. Run `docker-compose -f docker-compose.full.yml up`
2. Open the browser at [http://localhost:8080/](http://localhost:8080/) to see the dashboard

This will start all 3 services on your local machine,

[Reconfigure Cypress](#Reconfiguring-Cypress) to use `api_url: "http://localhost:1234/"`,

Run your tests `cypress run --parallel --record --key xxx --ci-build-id <buildId>` and you will see the results appear in the dashboard. Those cypress tests will run in parallel without connecting to the official dashboard.

Replace the s3 driver in compose file by dummy if you don't have access to s3 service.

## On-premise installation instructions

### Docker images

Each package has a Dockerfile - use it to build your own images.

Pre-built Docker images are available at https://hub.docker.com/u/agoldis.

Docker image tag corresponds to the git tag, while `latest` points to the `master` git branch.

Refer to `docker-compose.full.yml` for example.

### Is it legal?

Yes, Cypress is an [open source software](https://github.com/cypress-io/cypress/blob/develop/LICENSE).

### Is it production-ready?

Yes. (or maybe no)

## Additional Resources

- [Wiki](https://github.com/agoldis/sorry-cypress/wiki)
- [The official guide on Cypress parallelization](https://docs.cypress.io/guides/guides/parallelization.html)
- [CodeBuild configuration for running multiple Cypress Agents on AWS](https://github.com/agoldis/sorry-cypress/wiki/AWS-Multiple-Cypress-Agents-mlsad3) by [@mlsad3](https://github.com/mlsad3)
- [CodeBuild configuration for running multiple Cypress Agents on AWS](https://github.com/agoldis/sorry-cypress/wiki/AWS-Multiple-Cypress-Agents-KyleThenTR) by [@KyleThenTR](https://github.com/KyleThenTR)

## License

MIT
