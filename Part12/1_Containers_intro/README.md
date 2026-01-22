# Introduction to Containers

This section introduces containers, Docker, and the fundamental concepts needed to work with containerized applications.

## Overview

This part focuses on **configuration** rather than JavaScript code. Exercises may not require coding - applications are provided via GitHub, and your task is to configure them.

**Key Concepts:**
- Containers vs Virtual Machines
- Docker images and containers
- Basic Docker commands
- Working inside containers
- Using pre-built images

## What are Containers?

**Containers:**
- Encapsulate application into single package
- Include application and all dependencies
- Run isolated from other containers
- OS-level virtualization

**Benefits:**
- Quick to scale
- Run identically anywhere
- Cloud support
- Development and production

## Docker

**Docker:**
- Most popular containerization technology
- Set of products for managing containers
- Docker Engine, Docker Compose, Docker Hub

## Core Concepts

### Images vs Containers

- **Image:** Immutable file with code and dependencies
- **Container:** Runtime instance of an image
- **Metaphor:** Image = frozen treat, Container = eating it

### Image Names

Format: `registry/organisation/image:tag`

Example: `hello-world:latest`

## Basic Commands

```bash
# Run container
docker container run IMAGE-NAME

# Interactive container
docker container run -it ubuntu bash

# List containers
docker container ls -a

# Start container
docker start -i CONTAINER-NAME

# Remove container
docker container rm CONTAINER-NAME

# Copy file to container
docker container cp FILE CONTAINER:PATH

# Create image from container
docker commit CONTAINER-NAME NEW-IMAGE-NAME
```

## Exercises

- 12.1: Using command line and curl
- 12.2: Running Ubuntu container
- 12.3: Editing files in container
- 12.4: Installing Node.js in container

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Computing Tools for CS Studies](https://tkt-lapio.github.io/en/)
