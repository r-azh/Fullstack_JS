# Building and Configuring Environments - Summary

This section covers creating Dockerfiles, building images, using Docker Compose, setting up MongoDB and Redis, working with volumes, and debugging containers.

## Overview

Instead of manually modifying containers, we'll learn to build images using Dockerfiles and configure complete development environments with Docker Compose.

**Key Topics:**
- Dockerfile creation
- Building images
- Docker Compose
- MongoDB setup
- Redis setup
- Volumes and bind mounts
- Debugging containers

## Dockerfile

### What is a Dockerfile?

**Dockerfile:**
- Simple text file
- Contains instructions for creating image
- Better than manually modifying containers
- Can be version controlled

**Benefits:**
- Reproducible builds
- Version controlled
- Shareable
- Automated

### Basic Dockerfile

**File: `Dockerfile`**
```dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY ./index.js ./index.js

CMD node index.js
```

**Instructions Explained:**

1. **FROM node:20**
   - Base image for our image
   - Uses Node.js version 20
   - Official Node image from Docker Hub

2. **WORKDIR /usr/src/app**
   - Sets working directory
   - All following commands run here
   - Creates directory if doesn't exist
   - Prevents overwriting important files

3. **COPY ./index.js ./index.js**
   - Copies file from host to image
   - Format: `COPY source destination`
   - Copies `index.js` from current directory
   - Places it in `/usr/src/app/index.js`

4. **CMD node index.js**
   - Default command when container runs
   - Can be overwritten with arguments
   - Runs `node index.js` when started

### Building Images

**Command:**
```bash
docker build -t fs-hello-world .
```

**Flags:**
- `-t`: Tag (name) the image
- `.`: Build context (current directory)

**What Happens:**
- Docker reads Dockerfile
- Executes each instruction
- Creates layers for each step
- Builds final image

**Running Image:**
```bash
docker run fs-hello-world
# Output: Hello, World
```

**Overriding CMD:**
```bash
docker run -it fs-hello-world bash
# Opens bash instead of running node index.js
```

## Express Server Dockerfile

### Creating Express App

**Using express-generator:**
```bash
npx express-generator
npm install
DEBUG=playground:* npm start
```

**Basic Dockerfile:**
```dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY . .

CMD DEBUG=playground:* npm start
```

**Building and Running:**
```bash
docker build -t express-server .
docker run -p 3123:3000 express-server
```

**Port Mapping:**
- `-p 3123:3000`
- Format: `-p host-port:container-port`
- Host port 3123 → Container port 3000
- Access at http://localhost:3123

### Fixing Issues

**Problem: Copying node_modules**

**Issue:**
- `npm install` may install OS-specific dependencies
- Copying `node_modules` can break things
- Should install dependencies in container

**Solution 1: .dockerignore**

**File: `.dockerignore`**
```
.dockerignore
.gitignore
node_modules
Dockerfile
```

**Purpose:**
- Similar to `.gitignore`
- Prevents files from being copied
- Reduces image size
- Prevents issues

**Solution 2: Install in Container**

**Updated Dockerfile:**
```dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install
CMD DEBUG=playground:* npm start
```

**Key Point:**
- Only copy files you'd push to GitHub
- Don't copy build artifacts
- Don't copy dependencies
- Install during build

### Using npm ci

**Why npm ci?**

**Differences:**
- `npm install` may update package-lock.json
- `npm install` may install different versions (with ^ or ~)
- `npm ci` deletes node_modules first
- `npm ci` follows package-lock.json exactly
- `npm ci` doesn't alter files

**When to Use:**
- **npm ci:** Reliable builds, production
- **npm install:** Installing new dependencies

**Dockerfile:**
```dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm ci
CMD DEBUG=playground:* npm start
```

**Optimization:**
```dockerfile
RUN npm ci --omit=dev
```

**Purpose:**
- Don't install development dependencies
- Smaller image
- Faster builds
- Production-ready

### Environment Variables

**Using ENV Instruction:**

**File: `Dockerfile`**
```dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV DEBUG=playground:*
CMD npm start
```

**Benefits:**
- Set in Dockerfile
- Available in container
- Can be overridden
- Cleaner than CMD

### Dockerfile Best Practices

**Two Main Rules:**
1. Create **secure** images
2. Create **small** images

**Why:**
- Smaller = less attack surface
- Smaller = faster deployments
- More secure = fewer vulnerabilities

**Security: Don't Run as Root**

**Problem:**
- Containers run as root by default
- Security risk
- Should use non-root user

**Solution:**
```dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .
RUN npm ci

ENV DEBUG=playground:*

USER node
CMD npm start
```

**Changes:**
- `--chown=node:node`: Change ownership
- `USER node`: Switch to node user
- More secure

**Resources:**
- Snyk's 10 best practices for Node/Express
- Read for more security tips

## Docker Compose

### What is Docker Compose?

**Docker Compose:**
- Tool for managing multiple containers
- Declarative configuration (YAML)
- Can save to Git repository
- Better than scripts

**Benefits:**
- Manage multiple services
- Define relationships
- Version controlled
- Reproducible

### Basic docker-compose.yml

**File: `docker-compose.yml`**
```yaml
services:
  app:
    image: express-server
    build: .
    ports:
      - 3000:3000
```

**Explanation:**
- **services:** List of services
- **app:** Service name (can be anything)
- **image:** Image to use
- **build:** Build from Dockerfile if image not found
- **ports:** Port mappings

### Docker Compose Commands

**Build and Run:**
```bash
docker compose up
```

**Rebuild Images:**
```bash
docker compose up --build
```

**Run in Background:**
```bash
docker compose up -d
```

**Stop Services:**
```bash
docker compose down
```

**View Logs:**
```bash
docker compose logs
docker compose logs -f  # Follow logs
```

**Note:**
- Some older Docker versions use `docker-compose` (with hyphen)
- Prefer updating Docker
- Standalone `docker-compose` also works

## MongoDB Setup

### Finding MongoDB Image

**Docker Hub:**
- Search for "mongo"
- Official image: https://hub.docker.com/_/mongo
- Well-maintained
- Multiple versions

### Development Compose File

**File: `docker-compose.dev.yml`**
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
```

**Explanation:**
- **image:** MongoDB official image
- **ports:** Host 3456 → Container 27017
- **environment:** Configuration variables
  - `MONGO_INITDB_ROOT_USERNAME`: Root user
  - `MONGO_INITDB_ROOT_PASSWORD`: Root password
  - `MONGO_INITDB_DATABASE`: Database to create

**Running:**
```bash
docker compose -f docker-compose.dev.yml up -d
```

**View Logs:**
```bash
docker compose -f docker-compose.dev.yml logs -f
```

### Connecting to MongoDB

**Connection String:**
```bash
MONGO_URL=mongodb://localhost:3456/the_database npm run dev
```

**Problem: Authentication Required**

**Error:**
```
MongoError: command find requires authentication
```

**Solution:** Need to create user in database

## Bind Mounts

### What is a Bind Mount?

**Bind Mount:**
- Binds file/directory on host to container
- Changes in one reflect in other
- Useful for initialization scripts
- Useful for development

**Syntax:**
```yaml
volumes:
  - ./host-file:/container/path
```

**Format:**
- Host path first
- Container path second
- Separated by colon

### Initializing MongoDB

**Initialization Script:**

**File: `mongo/mongo-init.js`**
```javascript
db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('todos');

db.todos.insert({ text: 'Write code', done: true });
db.todos.insert({ text: 'Learn about containers', done: false });
```

**MongoDB Behavior:**
- Runs scripts in `/docker-entrypoint-initdb.d/`
- Only on first initialization
- Creates user and data

**Bind Mount in Compose:**
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
```

**Clean Start:**
```bash
docker compose -f docker-compose.dev.yml down --volumes
docker compose -f docker-compose.dev.yml up
```

**Permission Issues:**
```bash
chmod a+r mongo/mongo-init.js
```

**Alternative: Custom Image**

**If bind mount doesn't work:**

**File: `mongo/Dockerfile`**
```dockerfile
FROM mongo

COPY ./mongo-init.js /docker-entrypoint-initdb.d/
```

**Build:**
```bash
docker build -t initialized-mongo ./mongo
```

**Update compose:**
```yaml
services:
  mongo:
    image: initialized-mongo
    ports:
      - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
```

### Connecting with User

**Connection String:**
```bash
MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

**Format:**
- `mongodb://username:password@host:port/database`

## Volumes

### Why Volumes?

**Problem:**
- Containers don't preserve data by default
- Data lost when container removed
- Need persistent storage

**Solution: Volumes**

**Two Types:**
1. **Bind Mount:** Specify host location
2. **Named Volume:** Docker manages location

### Bind Mount for Data

**File: `docker-compose.dev.yml`**
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

**Explanation:**
- `./mongo_data` created on host
- Mapped to `/data/db` in container
- Data persists outside container
- **Add to .gitignore!**

### Named Volume

**File: `docker-compose.dev.yml`**
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
      - mongo_data:/data/db

volumes:
  mongo_data:
```

**Managing Volumes:**
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect VOLUME-NAME

# Remove volume
docker volume rm VOLUME-NAME
```

**Location:**
- Stored in Docker's directory
- Usually `/var/lib/docker/volumes/`
- Harder to find than bind mount

**When to Use:**
- **Bind Mount:** Need to know location, backup easier
- **Named Volume:** Don't care about location, Docker manages

## Redis

### What is Redis?

**Redis:**
- Key-value database
- Less structure than MongoDB
- No collections/tables
- Data fetched by key

**Characteristics:**
- In-memory by default
- Very fast
- No persistence by default

**Use Cases:**
- Caching
- Session storage
- Message broker
- Pub/Sub pattern

### Setting Up Redis

**File: `docker-compose.dev.yml`**
```yaml
services:
  mongo:
    # ... mongo config ...
  redis:
    image: redis
    ports:
      - 6379:6379
```

**Default Port:**
- Redis default: 6379
- Map to same port on host

**Connection:**
```bash
REDIS_URL=redis://localhost:6379 npm run dev
```

**Format:**
- `redis://host:port`

### Redis Persistence

**By Default:**
- Data not persisted
- Lost when container stops
- In-memory only

**Enable Persistence:**

**File: `docker-compose.dev.yml`**
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

**Explanation:**
- `command`: Override default command
- `--appendonly yes`: Enable persistence
- `volumes`: Store data in `./redis_data`
- **Add to .gitignore!**

## Debugging Containers

### The Challenge

**Configuration Debugging:**
- Either working or broken
- No partial states
- Need systematic approach
- Question everything

**Tools:**
- `docker exec`
- Container logs
- Inspect containers
- Test incrementally

### docker exec

**Purpose:**
- Jump into running container
- Execute commands
- Debug issues
- Inspect files

**Command:**
```bash
docker exec -it CONTAINER-NAME bash
```

**Example:**
```bash
# Start nginx
docker container run -d -p 8080:80 nginx

# Get container name
docker container ls

# Enter container
docker exec -it CONTAINER-NAME bash

# Inside container
root@CONTAINER-ID:/# cd /usr/share/nginx/html/
root@CONTAINER-ID:/# ls
root@CONTAINER-ID:/# echo "Hello, exec!" > index.html

# Exit
exit
```

**Key Points:**
- Container must be running
- Use `-it` for interactive
- Changes lost when container deleted
- Use `commit` to preserve

### Following Logs

**Editor's Note:**
- Essential to follow container logs
- Don't use detached mode (`-d`) during development
- Only when 200% sure everything works
- Then use detached mode
- When things break, back to logs

**Commands:**
```bash
# View logs
docker compose logs

# Follow logs
docker compose logs -f

# Service-specific logs
docker compose logs -f mongo
```

## MongoDB CLI

### Accessing MongoDB

**Using docker exec:**
```bash
docker exec -it CONTAINER-NAME mongosh -u root -p example
```

**Commands:**
```bash
# Show databases
show dbs

# Use database
use the_database

# Show collections
show collections

# Find documents
db.todos.find({})

# Insert document
db.todos.insert({ text: 'New todo', done: false })
```

## Redis CLI

### Accessing Redis

**Using docker exec:**
```bash
docker exec -it CONTAINER-NAME redis-cli
```

**Commands:**
```bash
# List all keys
KEYS *

# Get value
GET key-name

# Set value
SET key-name value

# Delete key
DEL key-name
```

## Best Practices

### 1. Use .dockerignore

```dockerfile
# ✅ Good: Exclude unnecessary files
.dockerignore
node_modules
.git
```

```dockerfile
# ❌ Bad: Copy everything
COPY . .
# Includes node_modules, .git, etc.
```

### 2. Install Dependencies in Container

```dockerfile
# ✅ Good: Install in container
COPY package*.json ./
RUN npm ci

# ❌ Bad: Copy node_modules
COPY . .
# Includes node_modules from host
```

### 3. Use npm ci for Production

```dockerfile
# ✅ Good: Reliable builds
RUN npm ci

# ❌ Bad: May change versions
RUN npm install
```

### 4. Don't Run as Root

```dockerfile
# ✅ Good: Use non-root user
COPY --chown=node:node . .
USER node

# ❌ Bad: Run as root
# Security risk
```

### 5. Use Same Ports

```yaml
# ✅ Good: Same port
ports:
  - 3000:3000

# ❌ Bad: Different ports
ports:
  - 3123:3000
# Hard to remember
```

### 6. Follow Logs During Development

```bash
# ✅ Good: See what's happening
docker compose up
# or
docker compose logs -f

# ❌ Bad: Detached mode
docker compose up -d
# Can't see errors
```

### 7. Use Volumes for Data

```yaml
# ✅ Good: Persist data
volumes:
  - ./mongo_data:/data/db

# ❌ Bad: No volume
# Data lost when container removed
```

## Common Issues and Solutions

### Issue: Application Doesn't Start

**Solution:**
- Check Dockerfile syntax
- Check logs: `docker compose logs`
- Verify ports are correct
- Check environment variables

### Issue: Can't Connect to Database

**Solution:**
- Verify database is running: `docker compose ps`
- Check connection string format
- Verify ports are mapped
- Check authentication credentials

### Issue: Data Not Persisting

**Solution:**
- Add volume to compose file
- Check volume is mounted
- Verify data directory exists
- Check permissions

### Issue: Permission Denied

**Solution:**
- Check file permissions
- Use `chmod` if needed
- Check user in container
- Verify bind mount paths

### Issue: Initialization Not Running

**Solution:**
- Check file is in correct location
- Verify bind mount path
- Check file permissions
- Remove volumes and restart

## Exercises

The exercises (12.5-12.12) involve:
- Containerizing Node application
- Using Docker Compose
- Setting up MongoDB
- Implementing todo routes
- Setting up Redis
- Implementing statistics endpoint
- Using Redis CLI
- Persisting Redis data
