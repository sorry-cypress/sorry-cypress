# sorry-cypress example

The example project contains a boilerplate express app, that returns a static web page.

There are 5 test files in `cypress/integration` - those are very simple tests that have `cy.wait(10000)` to slow them down a bit.

1. Run the demo web app (runs on port `3002`)

```
yarn && yarn start
```

2. In a separate terminal re-configure cypress to use your own dashboard service

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

3. Open several new terminals, in each run this command from within `example` directory:

```
npx cypress run --record --key whatever --parallel --ci-build-id local-01
```

You will see the tests running in parallel.
