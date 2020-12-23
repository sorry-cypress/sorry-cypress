#!/bin/bash

yarn run release-packages "$@" 
git add ./packages/**/package.json
yarn version "$@"