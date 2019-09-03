# sorry-cypress

An open-source alternative to Cypress dashboard service - run your tests in parallel in your own environment

## TL;DR

1. Set https://sorry-cypress.herokuapp.com/ as `api_url` of `...cypress.../packages/server/config/app.yml` (see below how to find file)
2. Run multiple instances of `cypress run --parallel --record --key xxx --ci-build-id <buildId>`
3. See the the tests running in parallel 🚀

## Why?

I was upset because:

- dashboard crashes and blocks my tests
- parallelization stops working after paid plan has reached its limit

Cypress is an open source, dashboard is not.

Tested with Cypress 3.4.1

## Start here

### 1. Set custom dashboard URL

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

### 2. Start the alternative dashboard

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
- Instance4 runs `D.spec.js` and `E.spec.js`
