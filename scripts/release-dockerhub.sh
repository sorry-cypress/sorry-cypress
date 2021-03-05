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

function getCleanTags() {
  echo $(echo ${GITHUB_REF} | sed -e "s/refs\/tags\///g")
}
function isSemver() {
  local cleanTags="$(getCleanTags)"
  local isSemver=$(./scripts/isSemver.js $cleanTags)
  [ "$isSemver" == "true" ]
}

function setDockerTags() {
  if isOnMaster; then
    TAGS="$TAGS latest"
  fi;

  if isGitTag && isSemver "${GITHUB_REF}"; then
    local cleanTags="$(getCleanTags)"
    TAGS=$(./scripts/generateSemverTags.js $cleanTags)
  fi;
}

function getTagsArg() {
  for TAG in ${TAGS}
  do
    echo "--tag ${1}:${TAG} "
  done
}

function dockerBuild() {
  echo 🔨 Building ${2} from ${1}: docker build --file ${1}/Dockerfile $(getTagsArg ${2})
  echo ========================
  docker build --file ${1}/Dockerfile $(getTagsArg ${2}) .
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

# ./scripts/release-dockerhub.sh -t cypress-v5
while getopts t: flag
do
    case "${flag}" in
        t) explicitTag=${OPTARG};;
    esac
done


if [ -z "${BRANCH}" ]
then
  echo "Explicit tag: $explicitTag";
  TAGS=${explicitTag}
else
  echo "Gettings tags from git data"
  setDockerTags
fi

echo 🚀 Releasing tags: $TAGS
echo ========================

dockerBuild "packages/director" "agoldis/sorry-cypress-director"
dockerBuild "packages/api" "agoldis/sorry-cypress-api"
dockerBuild "packages/dashboard" "agoldis/sorry-cypress-dashboard"

dockerPush "agoldis/sorry-cypress-director"
dockerPush "agoldis/sorry-cypress-api"
dockerPush "agoldis/sorry-cypress-dashboard"

echo ========================
echo 🎉 Released to Dockerhub: $TAGS