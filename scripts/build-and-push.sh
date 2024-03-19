#!/bin/sh

set -euo pipefail

if [[ -z "${ECR_URL:-}" ]]; then
    echo "Required ENV var not defined: ECR_URL"
fi

packages=("dashboard" "api" "director")

for package in "${packages[@]}"; do
    docker build . \
        -f packages/$package/Dockerfile \
        -t "$ECR_URL/sorry-cypress/sorry-cypress-$package" \
        --platform linux/amd64
done

for package in "${packages[@]}"; do
    docker push "$ECR_URL/sorry-cypress/sorry-cypress-$package"
done

