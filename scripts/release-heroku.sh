#! /bin/sh

set -e

DIRECTOR="sorry-cypress-director"
API="sorry-cypress-api"
DASHBOARD="sorry-cypress-dashboard"

herokuAppGet() {
  if [ "$1" == "$DIRECTOR" ]
  then
    echo "sorry-cypress-demo-director"
  fi 
  
  if [ "$1" == "$API" ]
  then
    echo "sorry-cypress-demo-api"
  fi

  if [ "$1" == "$DASHBOARD" ]
  then
    echo "sorry-cypress-demo"
  fi
}

echo "\n✅  Pulling the latest images from dockerhub..."

for container in $DIRECTOR $API $DASHBOARD; do
  docker pull agoldis/$container:latest
done

echo "\n✅  Logging in to heroku..."

heroku container:login

echo "\n✅  Tagging and pushing the images for heroku..."

for container in $DIRECTOR $API $DASHBOARD; do
  docker tag agoldis/$container:latest registry.heroku.com/`herokuAppGet $container`/web
  docker push registry.heroku.com/`herokuAppGet $container`/web
done


echo "\n✅  Releasing heroku apps..."
for container in $DIRECTOR $API $DASHBOARD; do
  heroku container:release --app `herokuAppGet $container` web  
done

