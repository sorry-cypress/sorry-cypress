<div align="center">
<div><img src="https://s3.amazonaws.com/agoldis.dev/images/sorry-cypress/logo.svg" /></div>
<div>:heart: An open-source on-premise, self-hosted alternative to Cypress dashboard :unicorn:</div>
</div>

## Table of contents

- [Features](#features)
- [Setup](#setup)
- [Demo & example](#demo-&-example)
- [On-premise installation instructions](#on-premise-installation-instructions)
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
- upload failure screenshots to S3 bucket
- browse test results, failures and screenshots
- run in light mode w/o persistency or with MongoDB storage attached
- on-premise self-hosted cypress dashboard by design - use your own infrastructure, own your data

## Setup

1. [Point Cypress to your service](#Reconfiguring-Cypress) - set `https://sorry-cypress-demo-director.herokuapp.com/` as `api_url` of `<cypress-root>/packages/server/config/app.yml`
2. Run multiple instances of `cypress run --parallel --record --key xxx --ci-build-id <buildId>`
3. See the the tests running in parallel 🚀

![Running Cypress test in parallel demo](https://s3.amazonaws.com/agoldis.dev/images/sorry-cypress/cypress.parallel.x2.3mb.gif)

## Demo & Example

Visit https://sorry-cypress-demo.herokuapp.com/ and see the alpha version of the web dashboard in action.

> This demo is a free heroku instance, it takes a minute to spin it up when you first navigate.

You can [reconfigure Cypress](#Reconfiguring-Cypress) to use `api_url: "https://sorry-cypress-demo-director.herokuapp.com/"`, run your tests and see the results appear in the dashboard.

Also consider the [example](https://github.com/agoldis/sorry-cypress/tree/master/example) with detailed example of parallelization.

The results of tests from the example app:
![Web dashboard prototype](https://s3.amazonaws.com/agoldis.dev/images/sorry-cypress/sorry-cypress-demo.gif)

## On-premise installation instructions

### Docker images

Each package has a Dockerfile - use it to build your own images.

There're also pre-built Docker images available at https://hub.docker.com/u/agoldis.

> As soon as https://github.com/agoldis/sorry-cypress/issues/12 is resolved, those will be updated automatically.

### Others

#### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/agoldis/sorry-cypress/tree/deploy-to-heroku)

... more to come ...

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

<!-- ### 2. Start the alternative dashboard

Run the service in cloud. For the demo, I am running it locally:

```bash
git clone https://github.com/agoldis/sorry-cypress
cd sorry-cypress

# default is http://localhost:1234/
yarn && yarn start
```

### 3. Run multiple instances of cypress

Run multuple instances of cypress. Make sure that they use the modified URL. Note that you don't have to provide a real `key`.

```
cypress run --record --key whatever --parallel --ci-build-id local-XXX
```

## For example

My example project has 5 spec files:

```
cypress/integration/A.spec.js
cypress/integration/B.spec.js
cypress/integration/C.spec.js
cypress/integration/D.spec.js
cypress/integration/E.spec.js
```

Running 4 instances of cypress in parallel: `cypress run --parallel --record --key xx --ci-build-id local-000`

- Instance 1 runs only `A.spec.js`
- Instance 2 runs only `B.spec.js`
- Instance 3 runs only `C.spec.js`
- Instance4 runs `D.spec.js` and `E.spec.js` -->

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

The service uses [`dotenv`](https://www.npmjs.com/package/dotenv) package - to change the default configuration, create `.env` file in service's root:

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

To enable this driver, set the configuration of `.env` file:

```
EXECUTION_DRIVER="../execution/mongo/driver"
MONGODB_URI="monodgb://your-DB-URI"
MONGODB_DATABASE="your-DB-name"
```

With MongoDB driver you can use the other services - `api` and `dashboard` to see the results of your runs.

#### Snapshots driver

...is what allows you to save the snapshots of failed tests.

It provides the client (Cypress runner) a URL for uploading the screenshots.

##### Dummy

Is the default driver and it does nothing - snapshots won't be saved.

You can set it explicity in `.env`:

```
SCREENSHOTS_DRIVER="../screenshots/dummy.driver"
```

##### S3 Driver

The driver generates upload URLs for S3 bucket. To enable it, set in `.env`:

```
SCREENSHOTS_DRIVER="../screenshots/s3.driver"
S3_BUCKET="your_bucket_name"
```

Please make sure that [AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) with proper access to invoke [`s3.getSignedUrl`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html) are available in the environment.

### `api` service

...is a simple GraphQL service, that allows to query the data persisted by MongoDB.

Create a `.env` file and define MongoDB connection details:

```
MONGODB_URI='mongodb://mongo:27017'
MONGODB_DATABASE='sorry-cypress'
```

### `dashboard` service

...is a web dashboard implemented in ReactJS. It is in alpha stage and still very naive - you can explore test details, failures and see screenshots.

In production mode you will need to provide environment variable `GRAPHQL_SCHEMA_URL` - graphql client will use the URL to download the schema.

E.g. in `.env` file:

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

The `director` service - yes. I have been using `https://sorry-cypress.herokuapp.com/` to run 500+ parallelized tests, each with ±90 spec files and 200+ tests.

The other services are still very naive.

### What Cypress clients does it support?

Tested with Cypress `3.4.1` and `3.2.0`

## License

MIT
