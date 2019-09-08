# sorry-cypress

An open-source alternative to Cypress dashboard.

- run cypress tests in parallel
- upload failure screenshots to S3 buckets
- browse test results and failures screenshots
- host on your own infrastructure

## TL;DR

1. [Point Cypress to your service](#pointing-cypress-to-your-service) - set `https://sorry-cypress.herokuapp.com/` as `api_url` of `<cypress-root>/packages/server/config/app.yml`
2. Run multiple instances of `cypress run --parallel --record --key xxx --ci-build-id <buildId>`
3. See the the tests running in parallel 🚀

![Running Cypress test in parallel demo](https://s3.amazonaws.com/agoldis.dev/images/sorry-cypress/cypress.parallel.x2.3mb.gif)

> Look into "example" directory

## Start here

The repository consists of 3 packages -
you can deploy them on your own infrastructure:

- [`packages/director`](#the-director) - is a service that's responsibe for parallelization and saving test results
- [`packages/api`](#the-api-service) - is a GraphQL server that allows to read test run details and results
- [`packages/dashboard`](#the-dashboard-service) - is a web dashboard (ReactJS)

### The `director`

The director service is responsible for:

- paralellization and coordination of test runs
- saving tests results
- saving failed tests screenshots

When you launch Cypress with on a CI environment with multiple machines, each instance first contacts a service to ask what specific test to run.

The dashboard coordinates the requests from differents machines and assigns tests to each.

That is what `director` service does 👆

#### Starting `director` service

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

By default, the service will start on port `1234` with `in-memory` execution driver and `dummy` snapshots driver.

That what is running on `https://sorry-cypress.herokuapp.com` - it is a stateless execution, that parallelizes tests, but does not persist test results and does not uploads screenshots for failed tests.

### Configuration

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

### Drivers

The `director` uses "drivers" for different aspects of its functionality.

#### Execution driver

...is what drives the execution flow.

There're 2 "execution drivers" implemented:

##### Stateless

Keeps the state of runs `in-memory`, restarting the service wipes everything.

That's the simplest and most naive implementation.

If you just want to be able to run the tests in parallel and don't worry about storing test results.

##### MongoDB persisted

The state - test runs and results - are persisted in MongoDB, thus, can be queried and displayed in a dashboard.

To enable this driver, set the configuration of `.env` file:

```
EXECUTION_DRIVER="../execution/mongo/driver"
MONGODB_URI="monodgb://your-DB-URI"
MONGODB_DATABASE="your-DB-name"
```

With MongoDB driver you can use the other services - `api` and `dashboard` to see the results of your runs

#### Snapshots driver

...is what allows to save the snapshots of failed tests.

It provides the client (Cypress runner) a URL for uploading the screenshots.

##### Dummy

Is the default driver and it does nothing - snapshots won't be saved

You can set it explicity in `.env`:

```
SCREENSHOTS_DRIVER="../screenshots/dummy.driver"
```

##### S3 Driver

The driver generates upload URLs for S3 buckets. To enable it, set in `.env`:

```
SCREENSHOTS_DRIVER="../screenshots/s3.driver"
S3_BUCKET="your_bucket_name"
```

Please make sure that [AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) with proper access to invoke [`s3.getSignedUrl`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html) are available in the environment.

Let's say we have 5 machines that are about to start running your tests.

### The `api` service

Is a simple GraphQL services that allows to query the data persisted by MongoDB.

More details to come...

### The `dashboard` service

Is a web-dashboard implemented in ReactJS, basically it just connects the the API and presents the data (still not) nicely.

## Behind the scenes

1. Each machine sends the same initial request with:

- specs lists
- machine hardware details
- git commit details
- `--ci-build-id` and other CLI parameters

2. The `director` creates or fetches an existing `run`, based on the parameters and responds with a randomly generated `machineId` and the allocated `runId`

3. Each cypress client requests a next available task for the `runId` which was returned previously.

4. The service looks at the list of specs and returns next available test.

> Original Cypress dashboard implements different "smart" strategies for picking the next test

5. When there're no more available tasks for a run, the services send an "empty" response - client reports it is finished.

---

The official guide on [Cypress parallelization](https://docs.cypress.io/guides/guides/parallelization.html).

## Pointing Cypress to your service

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

## FAQ

### Why?

I was upset because:

- dashboard crashes and blocks my tests
- parallelization stops working after paid plan has reached its limit

### Is it legal?

Yes, Cypress is an [open source software](https://github.com/cypress-io/cypress/blob/develop/LICENSE).

### Is it production-ready?

The `director` service - yes. I have been using `https://sorry-cypress.herokuapp.com/` to run 500+ parallelized tests, each with ±90 spec files and 200+ tests.

The other services are still very naive

### What Cypress clients does it support?

Tested with Cypress `3.4.1` and `3.2.0`

## Development

You can use the attached `docker-compose` to run all the services conveniently together.

The project uses [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/), bootstrap everything by running `yarn` in the root directory.

## License

MIT
