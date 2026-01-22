# Building and Configuring Environments

This section covers creating Dockerfiles, building images, using Docker Compose, setting up MongoDB and Redis, working with volumes, and debugging containers.

## Overview

Learn to build images using Dockerfiles and configure complete development environments with Docker Compose, including databases and other services.

**Key Topics:**
- Dockerfile creation
- Building images
- Docker Compose
- MongoDB setup
- Redis setup
- Volumes and bind mounts
- Debugging containers

## Dockerfile

### Basic Structure

```dockerfile
FROM node:20
WORKDIR /usr/src/app
COPY . .
RUN npm ci
CMD npm start
```

### Best Practices

- Use `.dockerignore`
- Install dependencies in container
- Use `npm ci` for production
- Don't run as root
- Use `ENV` for environment variables

## Docker Compose

### Basic Structure

```yaml
services:
  app:
    image: express-server
    build: .
    ports:
      - 3000:3000
```

### Commands

```bash
docker compose up
docker compose up --build
docker compose up -d
docker compose down
docker compose logs -f
```

## MongoDB Setup

### Development Compose

```yaml
services:
  mongo:
    image: mongo
    ports:
      - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - ./mongo_data:/data/db
```

## Redis Setup

### Basic Configuration

```yaml
services:
  redis:
    image: redis
    ports:
      - 6379:6379
    command: ['redis-server', '--appendonly', 'yes']
    volumes:
      - ./redis_data:/data
```

## Volumes

### Bind Mount

```yaml
volumes:
  - ./host-path:/container-path
```

### Named Volume

```yaml
volumes:
  - volume-name:/container-path
volumes:
  volume-name:
```

## Debugging

### docker exec

```bash
docker exec -it CONTAINER-NAME bash
```

### Logs

```bash
docker compose logs -f
```

## Exercises

- 12.5: Containerize Node application
- 12.6: Docker Compose setup
- 12.7: Implement MongoDB routes
- 12.8: MongoDB CLI
- 12.9: Set up Redis
- 12.10: Implement todo counter
- 12.11: Redis CLI
- 12.12: Persist Redis data

## Resources

- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
