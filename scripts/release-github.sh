#!/bin/bash

BASEDIR=$(dirname "$0")
cd  "$BASEDIR/.."

echo "Current version: $(cat ./package.json | grep version | awk -F":" '{ gsub(/[\",]/, "", $2); print $2; }')"
read -p 'Enter semver version e.g. 1.0.0-beta.1: ' semver

yarn run release-packages --new-version $semver
git add ./packages/**/package.json
yarn version --new-version $semver