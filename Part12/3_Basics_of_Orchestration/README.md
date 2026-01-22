# Basics of Orchestration

This section covers containerizing React applications, multi-stage builds, development in containers, container networking, and setting up Nginx reverse proxy.

## Overview

Learn to orchestrate multiple containers, set up development and production environments, and use reverse proxies for routing.

**Key Topics:**
- React in containers
- Multi-stage builds
- Development in containers
- Container networking
- Nginx reverse proxy
- Production setup

## React in Container

### Basic Dockerfile

```dockerfile
FROM node:20
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run build
RUN npm install -g serve
CMD ["serve", "dist"]
```

### Multi-Stage Build

```dockerfile
FROM node:20 AS build-stage
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
```

## Development in Containers

### Development Dockerfile

```dockerfile
FROM node:20
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD ["npm", "run", "dev", "--", "--host"]
```

### Development Compose

```yaml
services:
  app:
    build:
      context: .
      dockerfile: dev.Dockerfile
    volumes:
      - ./:/usr/src/app
    ports:
      - 5173:5173
```

## Container Networking

### Service Communication

- Services in same compose file = same network
- Use service names for communication
- DNS resolves service names
- No need to publish ports for internal communication

### depends_on

```yaml
services:
  nginx:
    depends_on:
      - frontend
      - backend
```

## Nginx Reverse Proxy

### Basic Configuration

```nginx
events { }

http {
  server {
    listen 80;
    
    location / {
      proxy_pass http://frontend:5173;
    }
    
    location /api/ {
      proxy_pass http://backend:3000/;
    }
  }
}
```

### Key Points

- Trailing slash removes location prefix
- WebSocket headers for hot-reload
- Service names for internal communication
- Only Nginx port needs publishing

## Exercises

- 12.13: Containerize React frontend
- 12.14: Testing during build
- 12.15: Frontend development environment
- 12.16: Backend development environment
- 12.17: Nginx in front of frontend
- 12.18: Nginx in front of backend
- 12.19: Connect frontend and backend
- 12.20: Production setup
- 12.21: Your app development environment
- 12.22: Your app production setup

## Resources

- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Compose Networking](https://docs.docker.com/compose/networking/)
