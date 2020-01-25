<div align="center">
<div><img src="https://s3.amazonaws.com/agoldis.dev/images/sorry-cypress/logo.png" width="128" /></div>
<div>:octocat: An open-source, on-premise, self-hosted alternative to Cypress dashboard :evergreen_tree:</div>
</div>

[![Gitter](https://badges.gitter.im/sorry-cypress/community.svg)](https://gitter.im/sorry-cypress/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## Table of contents

- [Features](#features)
- [Setup](#setup)
- [Demo & example](#demo--example)
  - [Cloud-based demo](#Cloud-based-demo)
  - [Run the demo locally (2 minutes)](#Run-the-demo-locally)
- [On-premise installation instructions](#on-premise-installation-instructions)
  - [Docker images](#docker-images)
  - [Heroku](#heroku)
- [Documentation](#documentation)
  - [Reconfiguring Cypress](#Reconfiguring-Cypress)
  - [Project structure](#project-structure)
  - [`director` service](#director-service)
  - [`api` service](#api-service)
  - [`dashboard` service](#dashboard-service)
- [Development](#development)
- [Behind the scenes](#behind-the-scenes)
- [FAQ](#faq)
- [License](#license)

## Features

- run cypress tests in parallel without any limitation
- upload failure screenshots and videos to S3 bucket
- browse test results, failures, screenshots and video recordings
- run in light mode w/o persistency or with MongoDB storage attached
- on-premise self-hosted cypress dashboard - use your own infrastructure, own your data

## Setup

1. [Point Cypress to your service](#Reconfiguring-Cypress) - set `https://sorry-cypress-demo-director.herokuapp.com/` as `api_url` of `<cypress-root>/packages/server/config/app.yml`
2. Run multiple instances of `cypress run --parallel --record --key xxx --ci-build-id <buildId>`
3. See the the tests running in parallel 🚀

![Running Cypress test in parallel demo](https://s3.amazonaws.com/agoldis.dev/images/sorry-cypress/cypress.parallel.x2.3mb.gif)

![Web dashboard prototype](https://s3.amazonaws.com/agoldis.dev/images/sorry-cypress/sorry-cypress-demo.gif)

## Demo & Example

### Cloud-based demo

Visit https://sorry-cypress-demo.herokuapp.com/ and see the alpha version of the web dashboard in action.

> This demo is a free heroku instance, it takes a minute to spin it up when you first navigate.

You can [reconfigure Cypress](#Reconfiguring-Cypress) to use `api_url: "https://sorry-cypress-demo-director.herokuapp.com/"`, run your tests and see the results appear in the dashboard.

Also consider the [example](https://github.com/agoldis/sorry-cypress/tree/master/example) with detailed example of parallelization.

### Run the demo locally

1. Run `docker-compose -f docker-compose.full.yml up`
2. Open the browser at [http://localhost:8080/](http://localhost:8080/) to see the dashboard

This will start all 3 services on your local machine.

[Reconfigure Cypress](#Reconfiguring-Cypress) to use `api_url: "http://localhost:1234/"`,

Run your tests `cypress run --parallel --record --key xxx --ci-build-id <buildId>` and you will see the results appear in the dashboard.

> You will need to [setup S3](https://github.com/agoldis/sorry-cypress/wiki/S3-screenshot-bucket-setup-instructions) to be able to upload failed test screenshots. Replace the credentials in `docker-compose.full.yml` after you've set up S3 bucket.

## On-premise installation instructions

### Docker images

Each package has a Dockerfile - use it to build your own images.

Pre-built Docker images are available at https://hub.docker.com/u/agoldis.

Docker image tag corresponds to the git tag, while `latest` points to the `master` git branch.

Refer to `docker-compose.full.yml` for example.

### Heroku

Click the button below to deploy the basic, in-memory configuration of `director` to Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/agoldis/sorry-cypress/tree/master)

If you need help deploying statefull version of the services, please file an issue!

#### More to come...

## Documentation

### Reconfiguring Cypress

Find cypress installation path

```bash
$ DEBUG=cypress:* cypress version

...
# here it is
cypress:cli Reading binary package.json from: /Users/agoldis/Library/Caches/Cypress/3.4.1/Cypress.app/Contents/Resources/app/package.json +0ms
...
```

In my case it is: `/Users/agoldis/Library/Caches/Cypress/3.4.1/Cypress.app/Contents/Resources/app/`

Change the default dashboard URL

```bash
$ cat /Users/agoldis/Library/Caches/Cypress/3.4.1/Cypress.app/Contents/Resources/app/packages/server/config/app.yml

...
# Replace this with a URL of the alternative dashboard
production:
  # api_url: "https://api.cypress.io/"
  api_url: "http://localhost:1234/"
...
```

### Project structure

The repository consists of 3 packages - you can deploy them on your own infrastructure:

- [`packages/director`](#the-director) - is a service that's responsibe for parallelization and saving test results
- [`packages/api`](#the-api-service) - is a GraphQL server that allows to read test run details and results
- [`packages/dashboard`](#the-dashboard-service) - is a web dashboard (ReactJS)

### `director` service

The `director` service is responsible for:

- paralellization and coordination of test runs
- saving tests results
- saving failed tests screenshots

When you launch Cypress on a CI environment with multiple machines, each machine first contacts the dashboard to get the next test to run.

The dashboard coordinates the requests from differents machines and assigns tests to each.

That is what `director` service does 👆

#### Starting the service

```sh
cd packages/director

npm install
npm run build
npm run start

# ...

Initializing "in-memory" execution driver...
Initializing "dummy" screenshots driver...
Listening on 1234...
```

By default, the service will start on port `1234` with in-memory execution driver and `dummy` snapshots driver.

That is what running on `https://sorry-cypress.herokuapp.com` - it is a stateless execution, that just parallelizes tests, but does not persist test results and does not uploads screenshots of failed tests.

#### Configuration

The service uses [`dotenv`](https://www.npmjs.com/package/dotenv) package - to change the default configuration, create `.env` file in service's root to set the default environment variables:

```sh
$ pwd
/Users/agoldis/sorry-cypress/packages/director

$ cat .env

PORT=1234

# DASHBOARD_URL is what Cypress client shows as a "Run URL"
DASHBOARD_URL="https://sorry-cypress.herokuapp.com"

# Read more about execution drivers below
EXECUTION_DRIVER="../execution/in-memory"

# Read more about screenshot drivers below
SCREENSHOTS_DRIVER="../screenshots/dummy.driver"
```

#### Drivers

The `director` uses "drivers" that define different aspects of its functionality.

#### Execution driver

...is what drives the execution flow.

There're 2 "execution drivers" implemented:

##### Stateless

Keeps the state of runs in-memory. That means that restarting the service wipes everything.

That's the simplest and most naive implementation.

If you just want to run the tests in parallel and not worry about storing test results.

##### MongoDB persisted

The state - test runs and results - are persisted in MongoDB, thus, can be queried and displayed in a dashboard.

To enable this driver, set the envrionment variables:

```
EXECUTION_DRIVER="../execution/mongo/driver"
MONGODB_URI="monodgb://your-DB-URI"
MONGODB_DATABASE="your-DB-name"
```

With MongoDB driver you can use the other services - `api` and `dashboard` to see the results of your runs.

#### Snapshots driver

...is what allows you to save the snapshots and videos tests.

It provides the client (Cypress runner) a URL for uploading the assets (videos and screenshots).

##### Dummy

Is the default driver and it does nothing - snapshots won't be saved.

Set the environment variable to define the screenshots driver.

```
SCREENSHOTS_DRIVER="../screenshots/dummy.driver"
```

##### S3 Driver

The driver generates upload URLs for S3 bucket. Set the environment variables accordingly:

```
SCREENSHOTS_DRIVER="../screenshots/s3.driver"
S3_BUCKET="your_bucket_name"
S3_REGION="us-east-1"
```

Please make sure that [AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) with proper access to invoke [`s3.getSignedUrl`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html) are available in the environment.

See the wiki page to help [setup S3 for uploading screenshots](https://github.com/agoldis/sorry-cypress/wiki/S3-screenshot-bucket-setup-instructions).

### `api` service

...is a simple GraphQL service, that allows to query the data persisted by MongoDB.

Set environment variables that define MongoDB connection details:

```
MONGODB_URI='mongodb://mongo:27017'
MONGODB_DATABASE='sorry-cypress'
```

### `dashboard` service

...is a web dashboard implemented in ReactJS. It is in alpha stage and still very naive - you can explore test details, failures and see screenshots.

In production mode you will need to provide environment variable `GRAPHQL_SCHEMA_URL` - graphql client will use the URL to download the schema.

Sett environment variable that defines the URL for getting the schema:

```
GRAPHQL_SCHEMA_URL=https://sorry-cypress-demo-api.herokuapp.com
```

You can explore currently available features at https://sorry-cypress-demo.herokuapp.com/.

## Development

The project uses [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/), bootstrap everything by running `yarn` in the root directory.

Run each package in development mode: `yarn dev`.

It is recommended to use `docker-compose` to run the backend services (`director` and `api`) and to run the `dashboard` on host machine.

### Using docker-compose for backend services

The project uses `docker-compose` to conviniently run backend services in dockerized containers.

Run `docker-compose build` from the project's root directory
Run `docker-compose up` to start the services.

The latter command will create 3 services:

- MongoDB instance on port `27017`
- `director` service on port `1234`
- `api` service on `4000`

You can change the configuration using the environment variables defined in `docker-compose.yml` file.

## Behind the scenes

1. Each machine sends the same initial request with:

- specs lists
- machine hardware details
- git commit details
- `--ci-build-id` and other CLI parameters

2. The `director` creates or fetches an existing `run`, based on the parameters and responds with a randomly generated `machineId` and the allocated `runId`

3. Each cypress client requests a next available task for the `runId` which was returned previously

4. The service looks at the list of specs and returns next available test

> Original Cypress dashboard implements different "smart" strategies for picking the next test

5. When there're no more available tests for a run, the service sends an "empty" response - client reports that it is finished

---

The official guide on [Cypress parallelization](https://docs.cypress.io/guides/guides/parallelization.html).

## FAQ

### Why?

I was upset because:

- dashboard crashes and blocks my tests
- parallelization stops working after paid plan has reached its limit

### Is it legal?

Yes, Cypress is an [open source software](https://github.com/cypress-io/cypress/blob/develop/LICENSE).

### Is it production-ready?

The `director` service - yes. I have been personally using it for my projects running thousands of parallelized test suites, each with ±90 spec files and overall 300+ tests.

The other services are still very naive. Pull requests and enhancements are welcome.

## License

MIT
