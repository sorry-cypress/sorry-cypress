#!/bin/bash

usage() { echo "Usage: $0 [-p <project>] [-n <service-prefix>]" 1>&2; exit 1; }

while getopts ":p:n:" flag
do
    case "${flag}" in
        n) 
          name=${OPTARG}
          ;;
        p)
          project=${OPTARG}
          ;;
        *)
          usage
          ;;
    esac
done
shift $((OPTIND-1))

if [ -z "${project}" ] || [ -z "${name}" ]; then
  usage
fi

echo "🚀  Starting deployment to Google Cloud Run. Project: ${project}, Services prefix: ${name}"

for i in director api dashboard; do
  fullname=$name-$i
  echo "🔧  Deploying ${name}-${i}..."
  docker pull agoldis/sorry-cypress-$i
  docker tag agoldis/sorry-cypress-$i gcr.io/${project}/$fullname
  docker push gcr.io/${project}/$fullname
  gcloud run deploy $fullname --image gcr.io/${project}/$fullname --platform managed --allow-unauthenticated; 
done

echo "🏁  Finished deployment to Google Cloud Run"

for i in director api dashboard; do
  fullname=$name-$i
  url=`gcloud run services describe test001-dashboard --platform managed | grep Traffic | awk '{ print $2 }'`
  echo "$fullname: $url"
done;


