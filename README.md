<div align="center">
<div><img src="https://s3.amazonaws.com/agoldis.dev/images/sorry-cypress/logo.png" width="128" /></div>
<div>:octocat: An open-source, on-premise, self-hosted alternative to Cypress dashboard :evergreen_tree:</div>
</div>

<br />

![Update Dockerhub Images](https://github.com/agoldis/sorry-cypress/workflows/Update%20Dockerhub%20Images/badge.svg?event=push)
![Update Dockerhub Images](https://github.com/agoldis/sorry-cypress/workflows/Lint%20and%20test/badge.svg)
<a href="https://join.slack.com/t/sorry-cypress/shared_invite/zt-eis1h6jl-tJELaD7q9UGEhMP8WHJOaw" target="_blank">![Join slack](https://img.shields.io/badge/join-slack-orange?logo=slack)<a/>

# Hello 👋🏻

Please help us by taking a short 1-minute [survey](https://forms.gle/qxoTPFiokLWuc6eZ7). Thank you!

## Table of contents

- [Features](#features)
- [Setup](#setup)
- [Demo & example](#demo--example)
  - [Cloud-based demo](#Cloud-based-demo)
  - [Run the demo locally (2 minutes)](#Run-the-demo-locally)
- [Terminology](#terminology)
- [On-premise installation instructions](#on-premise-installation-instructions)
  - [Docker images](#docker-images)
  - [🔥<span style="color: white; background: orange; padding: 2px 4px">new!</span> Heroku](#heroku)
  - [🔥<span style="color: white; background: orange; padding: 2px 4px">new!</span> Amazon AWS](#Amazon-AWS)
- [Reconfiguring Cypress Client](#Reconfiguring-Cypress)
  - [Manual setup](#Manual-configuration-change)
  - [Using CLI one-liner](#Using-one-liner)
  - [Using sorry-cypress wrapper](#Using-sorry-cypress-wrapper)
- [`director` service](#director-service)
  - [Starting the service](#starting-the-service)
  - [`director` configuration](#director-configuration)
  - [Drivers overview](#drivers-overview)
  - [Execution driver](#drivers-overview)
    - [Stateless execution driver](#stateless-execution-driver)
    - [Persisting execution driver](#persisting-execution-driver)
  - [Snapshots drivers](#snapshots-drivers)
    - [Dummy](#dummy)
    - [S3 storage driver](#s3-driver)
    - [🔥<span style="color: white; background: orange; padding: 2px 4px">new!</span> Minio driver](#minio-driver)
- [`api` service](#api-service)
- [`dashboard` service](#dashboard-service)
- [Development](#development)
- [Behind the scenes](#behind-the-scenes)
- [FAQ](#faq)
- [Additional Resources](#additional-resources)
- [License](#license)
- [Contributors](#contributors)

## Features

- run cypress tests in parallel without dashboard
- upload failure screenshots and videos to S3 bucket
- browse test results, failures, screenshots and video recordings
- run in light mode w/o persistency or with MongoDB storage attached
- on-premise self-hosted cypress dashboard - use your own infrastructure, own your data, no limitations

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

This will start all 3 services on your local machine,

[Reconfigure Cypress](#Reconfiguring-Cypress) to use `api_url: "http://localhost:1234/"`,

Run your tests `cypress run --parallel --record --key xxx --ci-build-id <buildId>` and you will see the results appear in the dashboard. Those cypress tests will run in parallel without connecting to the official dashboard.

> You will need to [setup S3](https://github.com/agoldis/sorry-cypress/wiki/S3-screenshot-bucket-setup-instructions) to be able to upload failed test screenshots. Replace the credentials in `docker-compose.full.yml` after you've set up S3 bucket.

## Terminology

The repository consists of 3 packages, each one represents a service:

- [`packages/director`](#the-director) - is a service that's responsibe for parallelization and saving test results
- [`packages/api`](#the-api-service) - is a GraphQL server that allows to read test run details and results
- [`packages/dashboard`](#the-dashboard-service) - is a web dashboard (ReactJS)

## On-premise installation instructions

### Docker images

Each package has a Dockerfile - use it to build your own images.

Pre-built Docker images are available at https://hub.docker.com/u/agoldis.

Docker image tag corresponds to the git tag, while `latest` points to the `master` git branch.

Refer to `docker-compose.full.yml` for example.

### Heroku

Moved to [Wiki - Heroku Tutorial](https://github.com/agoldis/sorry-cypress/wiki/Heroku-Tutorial)

### Amazon AWS

🎉 It takes just 5 minutes to deploy `sorry-cypress` on AWS using AWS CloudFormation template, you're getting a "full" version of the service with:

- Parallelization
- GraphQL API
- Web Dashboard
- S3 bucket preconfigured for storing screenshots and video recordings
- MongoDB as a persistance layer
- Secure network configuration via AWS VPC
- Pre-configured log groups via AWS Cloudwatch
- Convenient access via AWS Load Balancer

Read more in [Wiki - AWS Tutorial](https://github.com/agoldis/sorry-cypress/wiki/AWS-Tutorial) or just hit the button 👇🏻

[![Launch Stack](https://cdn.rawgit.com/buildkite/cloudformation-launch-stack-button-svg/master/launch-stack.svg)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=sorry-cypress&templateURL=https://s3.amazonaws.com/agoldis.dev/sorry-cypress/sorry-cypress-stack.yml)

## Reconfiguring Cypress Client

### Manual configuration change

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

### Using one-liner

Use this CLI one-liner to change cypress configuration (courtesy of [@MeStrak](https://github.com/MeStrak)):

```bash
> sed -i -e 's|api_url:.*$|api_url: "https://sorry-cypress-demo-director.herokuapp.com/"|g' /*/.cache/Cypress/*/Cypress/resources/app/packages/server/config/app.yml
```

Or for windows (by [@nickcox](https://github.com/nickcox)):

```powershell
ls $env:LOCALAPPDATA/Cypress/Cache -Recurse -Filter app.yml |
% { (Get-Content $_ -Raw) -replace "https://api.cypress.io/", "https://sorry-cypress-demo-director.herokuapp.com/" | Out-File $_ }
```

### Using sorry-cypress wrapper

Thanks [@janineahn](https://github.com/janineahn) and [@redaxmedia](https://github.com/redaxmedia) for this contribution!

Instead of changing the `api_url` in the cypress config, it's also possible to reroute the cypress api IP in your `/etc/hosts` file.

Sorry-cypress includes an executable helper for this, to use it run `sudo sorry-cypress` (superuser rights are necessary for editing the hosts file).

This command will use [hostile](https://github.com/feross/hostile) to change your hosts file and will start cypress in a child process.
Once Cypress is done or killed the rerouting rule in your hosts file will be deleted.

Please be aware of the following limitation before using `sorry-cypress.js` script:

- Only works with `etc/hosts` or `C:/Windows/System32/drivers/etc/hosts` present
- Only works with HTTPS on and port 443 on the target machine
- Has hard coded arguments for the cypress run
- Missing output that CLI started/finished

The command will need the following env variables:

- `SORRY_CYPRESS_RECORD_KEY`
- `SORRY_CYPRESS_API_IP`
- `SORRY_CYPRESS_BUILD_ID`

Example:

```sh
sudo SORRY_CYPRESS_BUILD_ID=build-001 SORRY_CYPRESS_RECORD_KEY=whateve SORRY_CYPRESS_API_IP=127.0.0.1 ./bin/sorry-cypress.js <other cypress arguments>
```

Find more method to configure cypress wrapper [Configuring cypress agents](https://github.com/agoldis/sorry-cypress/wiki/Configuring-cypress-agents) wiki article

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

The dashboard coordinates the requests from different machines and assigns tests to each.

### Starting the service

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

This configuratuin is running on `https://sorry-cypress.herokuapp.com` - a stateless execution driver, that just parallelizes tests, does not persist test results and does not persist screenshots of failed tests.

### `director` configuration

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

# Read more about record keys whitelist below
ALLOWED_KEYS="my_secret_key,my_another_secret_key"
```

Setting `ALLOWED_KEYS` variable allows you to define list of comma delimited record keys (provided to the Cypress Runner using `--key` option) which are accepted by the `director` service. This can be useful when Cypress is running on external CI servers and we need to expose `director` to the internet.

Empty or not provided variable means that all record keys are allowed.

### Drivers overview

The `director` uses "drivers" that define different aspects of its functionality. You can choose or implement different type of drivers to support the desired functionality. There're several community-supported drivers listed below.

### Execution driver

...is what drives the execution flow of `director` service.

#### Stateless execution driver

Keeps the state of runs in-memory. That means that restarting the service wipes everything.

That's the simplest and most naive implementation.

If you just want to run the tests in parallel and not worry about storing test results.

#### Persisting execution driver

The state - test runs and results - are persisted in MongoDB, thus, can be queried and displayed in a dashboard.

To enable this driver, set the envrionment variables:

```
EXECUTION_DRIVER="../execution/mongo/driver"
MONGODB_URI="monodgb://your-DB-URI"
MONGODB_DATABASE="your-DB-name"
```

With MongoDB driver you can use the other services - `api` and `dashboard` to browse the results of your runs.

### Snapshots drivers

...is what allows you to save the snapshots and videos tests.

It provides the client (Cypress runner) a URL for uploading generated assets (videos and screenshots).

#### Dummy

Is the default driver and it does nothing - snapshots won't be saved.

Set the environment variable to define the screenshots driver.

```
SCREENSHOTS_DRIVER="../screenshots/dummy.driver"
```

#### S3 Driver

S3 screenshots driver documentation has moved to [Wiki](https://github.com/agoldis/sorry-cypress/wiki/S3-screenshot-driver)

#### Minio Driver

Thanks @StefanS-O for contributing minio driver!

See [`docker-compose.minio.yml`](https://github.com/agoldis/sorry-cypress/blob/master/docker-compose.minio.yml) for ready-to-use sorry-cypress configuration that uses locally hosted Minio as a storage layer.

To run on the local machine, edit your `/etc/hosts` file to allow cypress agents discover the local instance of minio

```sh
127.0.0.1 storage
```

**Warning!** The example `docker-compose.minio.yml` deletes existing buckets, so please test - or remove from the docker file after first run!

You should be able to change the environment variables according to your Minio setup. Please refer to the default values at [`src/screenshots/minio/config.ts`](https://github.com/agoldis/sorry-cypress/blob/master/packages/director/src/screenshots/minio/config.ts).

The available minio configuration resembles S3 storage driver configruation.

Treat your Minio keys and secrets AWS credentials and hide them.

### `api` service

...is a simple GraphQL service, that allows querying data persisted by MongoDB.

Set environment variables that define MongoDB connection details:

```sh
MONGODB_URI='mongodb://mongo:27017'
MONGODB_DATABASE='sorry-cypress'
```

### `dashboard` service

...is a web dashboard implemented in ReactJS. It is still very naive but useful - you can explore test details, failures, see screenshots and video recordings (if enabled).

Set the environment variable `GRAPHQL_SCHEMA_URL` to the api service - GraphQL client will use it to pull schema definitions.

```sh
GRAPHQL_SCHEMA_URL='https://sorry-cypress-demo-api.herokuapp.com'
```

You can explore currently available features at https://sorry-cypress-demo.herokuapp.com/.

## Development

The project uses [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/), bootstrap everything by running `yarn` in the root directory.

Run each package in development mode: `yarn dev`.

It is recommended to use `docker-compose` to run the backend services (`director` and `api`) and to run the `dashboard` on host machine.

### Using docker-compose for backend services

The project uses `docker-compose` to conveniently run backend services in dockerized containers.

Run `docker-compose build` from the project's root directory
Run `docker-compose up` to start the services

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

## FAQ

### Why?

I was upset because:

- dashboard crashes and blocks my tests
- parallelization stops working after paid plan has reached its limit

### Is it legal?

Yes, Cypress is an [open source software](https://github.com/cypress-io/cypress/blob/develop/LICENSE).

### Is it production-ready?

Yes.

## Additional Resources

- [Wiki](https://github.com/agoldis/sorry-cypress/wiki)
- [The official guide on Cypress parallelization](https://docs.cypress.io/guides/guides/parallelization.html)
- [CodeBuild configuration for running multiple Cypress Agents on AWS](https://github.com/agoldis/sorry-cypress/wiki/AWS-Multiple-Cypress-Agents-mlsad3) by [@mlsad3](https://github.com/mlsad3)
- [CodeBuild configuration for running multiple Cypress Agents on AWS](https://github.com/agoldis/sorry-cypress/wiki/AWS-Multiple-Cypress-Agents-KyleThenTR) by [@KyleThenTR](https://github.com/KyleThenTR)
- [Cypress Parallelization on Jenkins using Sorry-Cypress](https://medium.com/@adityahbk/cypress-parallelization-on-jenkins-using-sorry-cypress-197a86ad8ed1) by [@huskywhale](https://github.com/huskywhale)

## License

MIT

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://jeffhicken.com"><img src="https://avatars3.githubusercontent.com/u/5297942?v=4" width="100px;" alt=""/><br /><sub><b>Jeff Hicken</b></sub></a><br /><a href="https://github.com/agoldis/sorry-cypress/commits?author=jhicken" title="Code">💻</a> <a href="#ideas-jhicken" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/janineahn"><img src="https://avatars3.githubusercontent.com/u/15375744?v=4" width="100px;" alt=""/><br /><sub><b>Janine</b></sub></a><br /><a href="https://github.com/agoldis/sorry-cypress/commits?author=janineahn" title="Code">💻</a> <a href="https://github.com/agoldis/sorry-cypress/commits?author=janineahn" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/xtroncode"><img src="https://avatars2.githubusercontent.com/u/3901381?v=4" width="100px;" alt=""/><br /><sub><b>Meet Shah</b></sub></a><br /><a href="https://github.com/agoldis/sorry-cypress/commits?author=xtroncode" title="Code">💻</a> <a href="https://github.com/agoldis/sorry-cypress/commits?author=xtroncode" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/abhidp"><img src="https://avatars0.githubusercontent.com/u/30851622?v=4" width="100px;" alt=""/><br /><sub><b>Abhi D</b></sub></a><br /><a href="https://github.com/agoldis/sorry-cypress/commits?author=abhidp" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/TomaszG"><img src="https://avatars0.githubusercontent.com/u/873114?v=4" width="100px;" alt=""/><br /><sub><b>TomaszG</b></sub></a><br /><a href="https://github.com/agoldis/sorry-cypress/commits?author=TomaszG" title="Code">💻</a> <a href="https://github.com/agoldis/sorry-cypress/commits?author=TomaszG" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/coreyshirk/"><img src="https://avatars1.githubusercontent.com/u/9434322?v=4" width="100px;" alt=""/><br /><sub><b>Corey Shirk</b></sub></a><br /><a href="https://github.com/agoldis/sorry-cypress/commits?author=coreyshirk" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/nickcox"><img src="https://avatars0.githubusercontent.com/u/135552?v=4" width="100px;" alt=""/><br /><sub><b>nickcox</b></sub></a><br /><a href="https://github.com/agoldis/sorry-cypress/commits?author=nickcox" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/MeStrak"><img src="https://avatars3.githubusercontent.com/u/31989238?v=4" width="100px;" alt=""/><br /><sub><b>MeStrak</b></sub></a><br /><a href="https://github.com/agoldis/sorry-cypress/commits?author=MeStrak" title="Documentation">📖</a> <a href="https://github.com/agoldis/sorry-cypress/commits?author=MeStrak" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mlsad3"><img src="https://avatars2.githubusercontent.com/u/15711477?v=4" width="100px;" alt=""/><br /><sub><b>mlsad3</b></sub></a><br /><a href="https://github.com/agoldis/sorry-cypress/commits?author=mlsad3" title="Documentation">📖</a> <a href="https://github.com/agoldis/sorry-cypress/commits?author=mlsad3" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/KyleThenTR"><img src="https://avatars3.githubusercontent.com/u/52414395?v=4" width="100px;" alt=""/><br /><sub><b>Kyle Then</b></sub></a><br /><a href="https://github.com/agoldis/sorry-cypress/commits?author=KyleThenTR" title="Documentation">📖</a></td>
    <td align="center"><a href="https://redaxmedia.com"><img src="https://avatars3.githubusercontent.com/u/1835397?v=4" width="100px;" alt=""/><br /><sub><b>Henry Ruhs</b></sub></a><br /><a href="#ideas-redaxmedia" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/adityatr"><img src="https://avatars0.githubusercontent.com/u/9066230?v=4" width="100px;" alt=""/><br /><sub><b>Aditya Trivedi</b></sub></a><br /><a href="#content-adityatr" title="Content">🖋</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
