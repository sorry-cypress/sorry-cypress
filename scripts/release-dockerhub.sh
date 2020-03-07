#! /bin/sh

set -e

BRANCH=$(echo ${GITHUB_REF} | sed -e "s/refs\/heads\///g" | sed -e "s/\//-/g")
TAGS="${BRANCH}"

echo BRANCH $BRANCH
echo GITHUB_REF $GITHUB_REF
echo TAGS $TAGS

function isGitTag() {
  [ $(echo "${GITHUB_REF}" | sed -e "s/refs\/tags\///g") != "${GITHUB_REF}" ]
}

function isOnMaster() {
  [ "${BRANCH}" = "master" ]
}

function isSemver() {
  echo "${1}" | grep -Eq '^refs/tags/v?([0-9]+)\.([0-9+])\.([0-9]+)$'
}

function getDockerTag() {
  if isOnMaster; then
    TAGS="latest"
  else isGitTag && isSemver "${GITHUB_REF}"
    TAGS=$(echo ${GITHUB_REF} | sed -e "s/refs\/tags\///g" | sed -E "s/v?([0-9]+)\.([0-9+])\.([0-9]+)/\1.\2.\3 \1.\2 \1/g")
  fi;
}

getDockerTag


echo TAGS $TAGS
