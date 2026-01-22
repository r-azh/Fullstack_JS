# Basics of Orchestration - Summary

This section covers containerizing React applications, multi-stage builds, development in containers, container networking, and setting up Nginx reverse proxy.

## Overview

Now that we understand Docker basics, we'll move to frontend containerization, multi-stage builds for optimization, development workflows in containers, and orchestration with reverse proxies.

**Key Topics:**
- React in containers
- Multi-stage builds
- Development in containers
- Container networking
- Nginx reverse proxy
- Production setup

## React in Container

### Creating React App

**Using Vite:**
```bash
npm create vite@latest hello-front -- --template react
cd hello-front
npm install
```

**Build for Production:**
```bash
npm run build
```

**Output:**
- Creates `dist/` directory
- Contains optimized static files
- Ready to be served

### Basic Dockerfile

**File: `Dockerfile`**
```dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build
```

**What It Does:**
- Uses Node 20 base image
- Sets working directory
- Copies all files
- Installs dependencies
- Builds production bundle

**Verify Build:**
```bash
docker build . -t hello-front
docker run -it hello-front bash
# Inside container:
ls dist
# Should see: assets, index.html, vite.svg
```

### Serving Static Files

**Option 1: Using serve**

**Install serve:**
```bash
npm install -g serve
```

**Serve files:**
```bash
serve dist
```

**Dockerfile with serve:**
```dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

RUN npm install -g serve
CMD ["serve", "dist"]
```

**Run:**
```bash
docker build . -t hello-front
docker run -p 5001:3000 hello-front
# Access at http://localhost:5001
```

**CMD Forms:**
- **Exec form:** `CMD ["serve", "dist"]` (preferred)
- **Shell form:** `CMD serve dist`
- Three forms total (see documentation)

## Multi-Stage Builds

### Why Multi-Stage?

**Problems with Single Stage:**
- Image contains build tools
- Image contains source code
- Image contains node_modules
- Large image size
- More vulnerabilities

**Benefits of Multi-Stage:**
- Smaller final image
- Only production files
- Less attack surface
- Faster upload/download
- Fewer vulnerabilities

### Multi-Stage Dockerfile

**File: `Dockerfile`**
```dockerfile
# Build stage
FROM node:20 AS build-stage
WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

# Production stage
FROM nginx:1.25-alpine
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
```

**How It Works:**
1. **Build stage:** Builds the application
2. **Production stage:** Only copies `dist/` directory
3. Everything else from build stage is discarded
4. Final image only has Nginx and static files

**Benefits:**
- Final image is much smaller
- No Node.js in production image
- No source code in production
- Uses Nginx (tried and true)

**Run:**
```bash
docker build . -t hello-front
docker run -p 8000:80 hello-front
# Access at http://localhost:8000
```

### Stage Naming

**Named Stages:**
- `FROM node:20 AS build-stage`
- Can reference in later stages
- `COPY --from=build-stage`

**Benefits:**
- Clear stage purposes
- Easy to reference
- Better organization

### Multi-Stage Optimizations

**Skipping Unused Stages:**
- Docker skips stages not used
- Can use stages for testing
- Must pass data to next stage

**Example: Testing Stage**
```dockerfile
FROM node:20 AS test-stage
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm test

FROM node:20 AS build-stage
WORKDIR /usr/src/app
COPY --from=test-stage /usr/src/app .
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
```

**Key Point:**
- Test stage must pass code to build stage
- Ensures tested code is built
- Build fails if tests fail

## Development in Containers

### Why Develop in Containers?

**Benefits:**
- Similar environment to production
- Avoid "works on my machine" issues
- Help new team members
- Only need container runtime
- Consistent across developers

**Tradeoffs:**
- Unconventional behavior
- Need to configure file access
- May need VS Code extensions

### Development Dockerfile

**File: `dev.Dockerfile`**
```dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD ["npm", "run", "dev", "--", "--host"]
```

**Key Differences:**
- `npm install` instead of `npm ci`
- Development mode
- `--host` flag for Vite
- No build step

**Why `--host`:**
- Vite dev server only listens on localhost by default
- Container's localhost ≠ host machine's localhost
- `--host` exposes to Docker network
- Can access from host machine

**Build:**
```bash
docker build -f ./dev.Dockerfile -t hello-front-dev .
```

**Run:**
```bash
docker run -p 5173:5173 hello-front-dev
```

### File Access with Volumes

**Problem:**
- Need to edit files
- Changes should hot-reload
- Files are in container

**Solution: Bind Mount**

**Command:**
```bash
docker run -p 5173:5173 -v "$(pwd):/usr/src/app/" hello-front-dev
```

**What It Does:**
- Maps current directory to container
- Changes in host reflect in container
- Hot-reload works
- Edit files on host machine

**Mac M1/M2 Issue:**
```
Error: Cannot find module @rollup/rollup-linux-arm64-gnu
```

**Problem:**
- Host has `@rollup/rollup-darwin-arm64`
- Container needs `@rollup/rollup-linux-arm64-gnu`
- Volume uses host's node_modules

**Solution:**
```bash
docker run -it -v "$(pwd):/usr/src/app/" hello-front-dev bash
# Inside container:
npm install
```

**Result:**
- Both versions installed
- Container works correctly

### Development Compose File

**File: `docker-compose.dev.yml`**
```yaml
services:
  app:
    image: hello-front-dev
    build:
      context: .
      dockerfile: dev.Dockerfile
    volumes:
      - ./:/usr/src/app
    ports:
      - 5173:5173
    container_name: hello-front-dev
```

**Explanation:**
- **context:** Build context (current directory)
- **dockerfile:** Which Dockerfile to use
- **volumes:** Bind mount for file access
- **ports:** Port mapping
- **container_name:** Custom name

**Run:**
```bash
docker compose -f docker-compose.dev.yml up
```

**Benefits:**
- No Node.js needed on host
- Edit files on host
- Changes hot-reload
- Consistent environment

### Installing Dependencies

**Problem:**
- Need to install new packages
- Volume uses host's node_modules
- May have architecture issues

**Solutions:**

**Option 1: Install in Container**
```bash
docker exec hello-front-dev npm install axios
```

**Option 2: Add to package.json and Rebuild**
- Add dependency to package.json
- Rebuild image: `docker build -f dev.Dockerfile -t hello-front-dev .`
- Restart container

## Container Networking

### Docker Compose Network

**Automatic Network:**
- Docker Compose creates network
- All services in same network
- DNS resolves service names
- Easy communication

**Service Names:**
- Service name = DNS name
- Container name also works
- Both can be used

### Testing Network with Busybox

**Add Busybox Service:**
```yaml
services:
  app:
    # ... frontend config ...
  debug-helper:
    image: busybox
```

**Busybox:**
- "Swiss Army Knife of Embedded Linux"
- Small executable with many tools
- Useful for debugging
- Includes wget, curl, etc.

**Test Connection:**
```bash
docker compose -f docker-compose.dev.yml run debug-helper wget -O - http://app:5173
```

**What Happens:**
- `app` is service name
- Resolves to container IP
- Port 5173 is container port
- Works within Docker network

### Port Publishing

**Important:**
- Published ports (`ports:`) are for **external access**
- Internal ports don't need publishing
- Services in same network can access each other
- Only expose what's needed

**Example:**
```yaml
services:
  app:
    ports:
      - 3210:5173  # External: 3210, Internal: 5173
  debug-helper:
    # No ports needed!
```

**Access:**
- From host: `http://localhost:3210`
- From container: `http://app:5173`
- Both work, different ports

### depends_on

**Purpose:**
- Ensure startup order
- Wait for service to start
- Add to DNS before use

**Example:**
```yaml
services:
  app:
    # ...
  nginx:
    depends_on:
      - app
```

**Important:**
- Only waits for container to start
- Does NOT wait for service to be ready
- Service may still be starting
- For readiness, use other solutions

## Nginx Reverse Proxy

### What is a Reverse Proxy?

**Definition:**
- Retrieves resources on behalf of client
- Returns resources as if from proxy
- Single point of entry
- Routes requests to backend services

**Benefits:**
- Single entry point
- Load balancing
- SSL termination
- Request routing

### Nginx Configuration

**File: `nginx.dev.conf`**
```nginx
events { }

http {
  server {
    listen 80;

    location / {
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      
      proxy_pass http://app:5173;
    }
  }
}
```

**Explanation:**
- **events:** Required block
- **http:** HTTP server configuration
- **server:** Virtual server
- **listen 80:** Listen on port 80
- **location /:** Handle root path
- **proxy_http_version:** HTTP version for proxy
- **proxy_set_header:** Headers for WebSocket
- **proxy_pass:** Where to forward requests

**WebSocket Support:**
- Required for Vite hot-reload
- `Upgrade` and `Connection` headers
- Allows WebSocket connections

### Nginx Service in Compose

**File: `docker-compose.dev.yml`**
```yaml
services:
  app:
    # ... frontend config ...
  nginx:
    image: nginx:1.20.1
    volumes:
      - ./nginx.dev.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    container_name: reverse-proxy
    depends_on:
      - app
```

**Explanation:**
- **image:** Nginx official image
- **volumes:** Mount config file (read-only)
- **ports:** Host 8080 → Container 80
- **depends_on:** Wait for app to start

**Naming Convention:**
- `nginx.dev.conf` for development
- `nginx.conf` for production

### Common Issues

**Issue: 502 Bad Gateway**

**Problem:**
- `proxy_pass http://localhost:5173`
- localhost in container = container itself
- Not the app container

**Solution:**
- Use service name: `http://app:5173`
- Service name resolves via DNS
- Works within Docker network

**Test DNS:**
```bash
docker exec -it reverse-proxy bash
curl http://app:5173
# Should return HTML
```

## Production Setup

### Complete Production Compose

**File: `docker-compose.yml`**
```yaml
services:
  frontend:
    build:
      context: ./todo-frontend
      dockerfile: Dockerfile
    # No ports needed (accessed via Nginx)

  backend:
    build:
      context: ./todo-backend
      dockerfile: Dockerfile
    environment:
      - MONGO_URL=mongodb://mongo:27017/the_database
      - REDIS_URL=redis://redis:6379
    # No ports needed

  mongo:
    image: mongo
    volumes:
      - mongo_data:/data/db
    # No ports needed

  redis:
    image: redis
    command: ['redis-server', '--appendonly', 'yes']
    volumes:
      - redis_data:/data
    # No ports needed

  nginx:
    image: nginx:1.20.1
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    depends_on:
      - frontend
      - backend

volumes:
  mongo_data:
  redis_data:
```

**Key Points:**
- Only Nginx exposes port
- Services communicate internally
- Environment variables for connections
- Volumes for data persistence

### Production Nginx Config

**File: `nginx.conf`**
```nginx
events { }

http {
  server {
    listen 80;

    # Frontend
    location / {
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      
      proxy_pass http://frontend:80;
    }

    # Backend API
    location /api/ {
      proxy_pass http://backend:3000/;
    }
  }
}
```

**Key Points:**
- Frontend at root `/`
- Backend at `/api/`
- Trailing slash removes `/api` prefix
- `/api/todos` → `/todos` in backend

## Understanding Request Flow

### Development Flow

**Browser Request:**
1. Browser → `http://localhost:8080/`
2. Nginx receives request
3. Nginx → `http://frontend:5173/`
4. Frontend serves React app
5. Browser downloads React code
6. React code executes in browser

**API Request:**
1. Browser → `http://localhost:8080/api/todos`
2. Nginx receives request
3. Nginx → `http://backend:3000/todos` (removes `/api`)
4. Backend processes request
5. Response back through Nginx
6. Browser receives response

### Important Understanding

**React App Execution:**
- React code runs in **browser**
- Not in container!
- Container only serves source code
- Browser executes JavaScript

**Container Access:**
- Frontend container accessed once (initial load)
- Backend container accessed for API calls
- All through Nginx

## Best Practices

### 1. Use Multi-Stage Builds

```dockerfile
# ✅ Good: Multi-stage
FROM node:20 AS build-stage
# ... build ...
FROM nginx:alpine
COPY --from=build-stage /dist /usr/share/nginx/html

# ❌ Bad: Single stage
FROM node:20
# ... everything ...
# Large image, many vulnerabilities
```

### 2. Separate Dev and Prod Dockerfiles

```dockerfile
# ✅ Good: Separate files
Dockerfile          # Production
dev.Dockerfile      # Development

# ❌ Bad: One file for both
# Hard to maintain, confusing
```

### 3. Use Service Names for Communication

```yaml
# ✅ Good: Service name
proxy_pass http://app:5173

# ❌ Bad: localhost
proxy_pass http://localhost:5173
# Doesn't work in containers
```

### 4. Only Expose Nginx Port

```yaml
# ✅ Good: Only Nginx exposed
nginx:
  ports:
    - 8080:80
# Other services internal only

# ❌ Bad: All services exposed
# Security risk, unnecessary
```

### 5. Use depends_on for Startup Order

```yaml
# ✅ Good: Wait for dependencies
nginx:
  depends_on:
    - frontend
    - backend

# ❌ Bad: No ordering
# May fail if services not ready
```

### 6. Use Volumes for Development

```yaml
# ✅ Good: Bind mount for dev
volumes:
  - ./:/usr/src/app

# ❌ Bad: No volume
# Can't edit files, no hot-reload
```

### 7. Trailing Slash in proxy_pass

```nginx
# ✅ Good: Removes prefix
location /api/ {
  proxy_pass http://backend:3000/;
}
# /api/todos → /todos

# ❌ Bad: Keeps prefix
location /api/ {
  proxy_pass http://backend:3000;
}
# /api/todos → /api/todos (wrong!)
```

## Common Issues and Solutions

### Issue: 502 Bad Gateway

**Problem:**
- Nginx can't reach backend/frontend
- Wrong service name
- Service not started

**Solution:**
- Check service names match
- Verify services are running
- Test DNS: `curl http://service-name:port`
- Check depends_on configuration

### Issue: Hot Reload Not Working

**Problem:**
- Changes not reflected
- WebSocket not working

**Solution:**
- Check `--host` flag in CMD
- Verify WebSocket headers in Nginx
- Check volume mount is correct
- Restart container

### Issue: Architecture Mismatch (Mac M1/M2)

**Problem:**
- `@rollup/rollup-linux-arm64-gnu` not found
- Host has different architecture

**Solution:**
- Install dependencies in container
- Use `docker exec` to run npm install
- Or use platform-specific images

### Issue: proxy_pass Keeps /api Prefix

**Problem:**
- Request to `/api/todos` goes to `/api/todos` in backend
- Backend expects `/todos`

**Solution:**
- Add trailing slash: `proxy_pass http://backend:3000/;`
- Trailing slash removes location prefix

### Issue: Service Not Found

**Problem:**
- DNS resolution fails
- Can't connect to service

**Solution:**
- Check service name spelling
- Verify services in same compose file
- Check network configuration
- Use `docker compose ps` to verify

## Exercises

The exercises (12.13-12.22) involve:
- Containerizing React frontend
- Testing during build process
- Setting up development environment
- Running backend in development container
- Setting up Nginx reverse proxy
- Connecting frontend and backend
- Creating production setup
- Applying to your own applications
