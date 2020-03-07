#!/bin/bash

set -e

BRANCH=$(echo ${GITHUB_REF} | sed -e "s/refs\/heads\///g" | sed -e "s/\//-/g")
TAGS=""

echo BRANCH $BRANCH
echo GITHUB_REF $GITHUB_REF

function isGitTag() {
  [ $(echo "${GITHUB_REF}" | sed -e "s/refs\/tags\///g") != "${GITHUB_REF}" ]
}

function isOnMaster() {
  [ "${BRANCH}" = "master" ]
}

function isSemver() {
  echo "${1}" | grep -Eq '^refs/tags/v?([0-9]+)\.([0-9+])\.([0-9]+)$'
}

function setDockerTags() {
  if isOnMaster; then
    TAGS="$TAGS latest"
  fi;

  if isGitTag && isSemver "${GITHUB_REF}"; then
    TAGS="$TAGS $(echo ${GITHUB_REF} | sed -e "s/refs\/tags\///g" | sed -E "s/v?([0-9]+)\.([0-9+])\.([0-9]+)/\1.\2.\3 \1.\2 \1/g")"
  fi;
}

function getTagsArg() {
  for TAG in ${TAGS}
  do
    echo "--tag ${1}:${TAG} "
  done
}

function dockerBuild() {
  echo 🔨 Building ${2} from ${1}: docker build ${1} --file ${1}/Dockerfile $(getTagsArg ${2})
  echo ========================
  docker build ${1} --file ${1}/Dockerfile $(getTagsArg ${2})
  echo ========================
  echo ✅ Build completed ${2} from ${1} 
}

function dockerPush() {
  for TAG in ${TAGS}
  do
    echo 💾 Pushing to remote: docker push ${1}:${TAG}
    echo ========================
    docker push "${1}:${TAG}"
    echo ========================
    echo ✅ Pushed "${1}:${TAG}"
  done
}

setDockerTags

echo 🚀 Releasing tags: $TAGS
echo ========================

dockerBuild "packages/director" "agoldis/test-deploy-director"
dockerBuild "packages/api" "agoldis/test-deploy-api"
dockerBuild "packages/dashboard" "agoldis/test-deploy-dashboard"

dockerPush "agoldis/test-deploy-director"
dockerPush "agoldis/test-deploy-api"
dockerPush "agoldis/test-deploy-dashboard"

echo ========================
echo 🎉 Released to Dockerhub: $TAGS