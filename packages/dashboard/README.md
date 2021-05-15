# Running dashboard as a non-root user

Standard Nginx docker image requires privileged user to in order run properly, i.e. your user needs to be added to default docker group. More [info](https://docs.docker.com/engine/install/linux-postinstall/). On the other hand, in some corporate networks, docker engine has been configured to run under non-root user which requires additional steps to setup.

## 1. Getting config files

First you need to start sorry-cypress dashboard image to extract default configuration files.

```
docker run -it --user <name|uid>[:<group|gid>] --name dashboard agoldis/sorry-cypress-dashboard:latest /bin/sh
```

Then you need to copy 2 configuration files from running container to your host. Open a new terminal without terminating the previous one.

```
docker cp dashboard:/etc/nginx/nginx.conf .
docker cp dashboard:/etc/nginx/templates/default.conf.template default.conf
```

Now you can remove the current running container.

```
docker rm dashboard -f
```

## 2. Adjusting config files

Now it's time to tweak a little bit config files from default image.

### nginx.conf

1. Comment out the user directive:

```
#user nginx
```

2. Replace all directives that point to `/var/*` to `/tmp` instead:

```
error_log /tmp/error.log warn;
pid /tmp/nginx.pid;

access_log /tmp/access.log main;
```

3. Add these directives in http section:

```
http {
    client_body_temp_path /tmp/client_temp;
    proxy_temp_path       /tmp/proxy_temp_path;
    fastcgi_temp_path     /tmp/fastcgi_temp;
    uwsgi_temp_path       /tmp/uwsgi_temp;
    scgi_temp_path        /tmp/scgi_temp;
}
```

### default.config

You just need to replace all `${}` string pattern to your matching environment variables. Example:

from:

```
listen ${PORT} default_server;
```

to:

```
listen 8080 default_server;
```

_Make sure you choose a port > 1024 to be bindable from a non-root user._

## 3. Copying config files

Now, let's create a new container with default entry point. Don't worry, initial boot will fail.

```
docker run -it --user <name|uid>[:<group|gid>] --name dashboard agoldis/sorry-cypress-dashboard:latest
```

Then, copy updated config files:

```
docker cp nginx.conf dashboard:/etc/nginx
docker cp default.conf dashboard:/etc/nginx/conf.d
```

## 4. Running updated container

Now, you can run sorry-cypress dashboard under unprivileged user, simply but doing:

```
docker start dashboard
```

You're done!
