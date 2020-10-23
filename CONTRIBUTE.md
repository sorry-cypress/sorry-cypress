## Running the services in dev mode

Starting the services with exposed ports by including the `docker-compose.dev.yml` file as following:

### default

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`

### minio

`docker-compose -f docker-compose.minio.yml -f docker-compose.dev.yml up`

### full

`docker-compose -f docker-compose.full.yml -f docker-compose.dev.yml up`
